import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ENVIRONMENT_INITIALIZER, EnvironmentProviders, inject, Provider } from '@angular/core';
import { AuthService } from './auth.service';
import { authInterceptor } from './auth.interceptor';


/**
 * Provides authentication-related services and HTTP interceptors.
 * - Registers the authInterceptor for HTTP requests
 * - Ensures AuthService is initialized at application start
 *
 * @returns {(Array<Provider | EnvironmentProviders>)} Array of providers for dependency injection
 */
export const provideAuth = (): Array<Provider | EnvironmentProviders> => [
    provideHttpClient(withInterceptors([authInterceptor])),
    {
        provide: ENVIRONMENT_INITIALIZER,
        useValue: () => inject(AuthService),
        multi: true,
    },
];
