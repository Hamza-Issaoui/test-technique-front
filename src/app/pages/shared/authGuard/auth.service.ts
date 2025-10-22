import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, of, tap } from 'rxjs';
import { env } from '../../../../environment/environment';
import { SocketService } from '../socket.service';
import { AuthUtils } from './authUtils';

// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private path = env.envUrl;
  authToken: string | undefined;
  private _authenticated: boolean = false;

  constructor(
    private _httpClient: HttpClient,
    private socketService: SocketService
  ) {
    // Récupérer le token au démarrage du service
    this.initializeAuthToken();
  }

  /**
 * Initialize authentication token from localStorage if present.
 */
  private initializeAuthToken(): void {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      this.authToken = storedToken;
      this._authenticated = true;
    }
  }

  /**
 * Get the current authentication token.
 * @returns {string | null} The JWT auth token or null if not present
 */
  getAuthToken(): string | null {
    if (this.authToken) {
      return this.authToken;
    }
    return localStorage.getItem('authToken');
  }

  /**
 * Register a new user with provided user data.
 * @param {any} userData - The registration data for the new user
 * @returns {Observable<any>} Observable of the HTTP POST response
 */
  register(userData: any) {
    const url = `${this.path}/api/auth/registerUser`;
    return this._httpClient.post(url, userData);
  }

  /**
 * Log in a user with provided credentials.
 * Stores token and user info on successful login.
 * @param {any} userData - Login credentials
 * @returns {Observable<any>} Observable of the HTTP POST response
 */
  login(userData: any) {
    const url = `${this.path}/api/auth/login`;
    return this._httpClient.post(url, userData).pipe(
      tap((res: any) => {
        if (res.success) {
          this.storeToken(res.token);
          localStorage.setItem('user', JSON.stringify(res.user));
          this.authToken = res.token;
          this._authenticated = true;
        }
      }),
      catchError((error) => {
        console.error('Error in login:', error);
        throw error;
      })
    );
  }

/**
 * Store the JWT token in memory, localStorage, and connect socket.
 * @param {string} token - The JWT token to store
 */
  private storeToken(token: string) {
    this.authToken = token;
    localStorage.setItem('authToken', token);
    this.socketService.connect(token);
    this._authenticated = true;
  }

  /**
 * Check if the user is logged in and the token is valid.
 * @returns {boolean} True if logged in and token not expired, otherwise false
 */
  isLoggedIn(): boolean {
    const token = this.getAuthToken();
    return !!token && !AuthUtils.isTokenExpired(token);
  }

  /**
 * Log out the current user, remove token and user info, disconnect socket.
 */
  logout(): void {
    this.authToken = undefined;
    this._authenticated = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    this.socketService.disconnect();
  }

  
/**
 * Get the currently logged-in user from localStorage.
 * @returns {any | null} The user object or null if not logged in
 */
  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  /**
 * Check if the authentication token is valid and update auth state.
 * @returns {Observable<boolean>} Observable that emits true if valid, false otherwise
 */
  check(): Observable<boolean> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      this._authenticated = false;
      return of(false);
    }

    // Vérifier si le token est expiré
    if (AuthUtils.isTokenExpired(token)) {
      this.logout();
      return of(false);
    }

    // Si le token est valide, mettre à jour les propriétés
    this.authToken = token;
    this._authenticated = true;

    return of(true);
  }

  
/**
 * Sign in the user using an existing token.
 * @returns {Observable<any>} Observable of the authentication check
 */
  signInUsingToken(): Observable<any> {
    return this.check();
  }
}
