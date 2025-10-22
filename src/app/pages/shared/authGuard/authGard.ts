import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';
import { AuthService} from "./auth.service";

export const AuthGuard: CanActivateFn | CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);
    const authService = inject(AuthService);

    // Vérifier d'abord synchronement si un token existe
    const token = authService.getAuthToken();
    
    if (!token) {
        return router.parseUrl('login');
    }

    // Ensuite vérifier plus en détail (expiration, etc.)
    return authService.check().pipe(
        switchMap((authenticated) => {
            if (!authenticated) {
                const urlTree = router.parseUrl('login');
                return of(urlTree);
            }
            return of(true);
        })
    );
};