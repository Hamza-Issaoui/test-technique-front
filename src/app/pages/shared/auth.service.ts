import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { catchError, tap } from 'rxjs'
import { env } from '../../../environment/environment';

@Injectable()
export class AuthService {
    private path = env.envUrl
    private authToken: string | undefined;

    constructor(private _httpClient: HttpClient) { }

    register(userData: any) {
        const url = `${this.path}/registerUser`
        return this._httpClient.post(url, userData)
    }

    login(userData: any) {
        const url = `${this.path}/login`;
        return this._httpClient.post(url, userData)
          .pipe(
            tap((res: any) => {
              if (res.success) {
                this.storeToken(res.token);
              }
            }),
            catchError((error) => {
              console.error('Error in login:', error);
              throw error;
            })
          );
      }
    
      private storeToken(token: string) {
        this.authToken = token;
        localStorage.setItem('authToken', token);
      }
    
      getAuthToken(): string | undefined {
        const token = localStorage.getItem('authToken');
        return token !== null ? token : this.authToken;
    }

}
