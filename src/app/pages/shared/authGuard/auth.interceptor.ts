import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpRequest, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { AuthUtils } from './authUtils';

import { catchError, Observable, tap, throwError } from 'rxjs';

/**
 * HTTP interceptor to add Authorization header with JWT token if available and valid.
 * Logs warnings if token is missing or expired. Handles 401 Unauthorized responses
 * by logging out the user and reloading the page.
 *
 * @param {HttpRequest<unknown>} req - The outgoing HTTP request
 * @param {HttpHandlerFn} next - The next interceptor or HTTP handler
 * @returns {Observable<HttpEvent<unknown>>} The HTTP event stream
 */
export const authInterceptor = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const token = authService.getAuthToken();

    let newReq = req.clone();

    if (token && !AuthUtils.isTokenExpired(token)) {
        newReq = req.clone({
            headers: req.headers.set('Authorization', `Bearer ${token}`),
        });
    } else {
        console.warn('❌ Authorization header NOT added:', !token ? 'No token' : 'Token expired');
    }

    return next(newReq).pipe(
        catchError((error) => {
            if (error instanceof HttpErrorResponse && error.status === 401) {
                authService.logout();
                location.reload();
            }
            return throwError(() => error);
        })
    );
};
