import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withEnabledBlockingInitialNavigation, withHashLocation, withInMemoryScrolling, withRouterConfig, withViewTransitions } from '@angular/router';
import { provideAuth } from './pages/shared/authGuard/auth.provide';
import { IconSetService } from '@coreui/icons-angular';
import { DropdownModule, SidebarModule } from '@coreui/angular';
import { routes } from './app.routes';

/**
 * Application configuration for Angular, including providers and router setup.
 * - Registers authentication services via provideAuth()
 * - Configures router with routes, scrolling, initial navigation, view transitions, and hash location
 * - Imports Sidebar and Dropdown modules
 * - Provides icon services and animations
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideAuth(),
    provideRouter(routes,
      withRouterConfig({
        onSameUrlNavigation: 'reload'
      }),
      withInMemoryScrolling({
        scrollPositionRestoration: 'top',
        anchorScrolling: 'enabled'
      }),
      withEnabledBlockingInitialNavigation(),
      withViewTransitions(),
      withHashLocation()
    ),
    importProvidersFrom(SidebarModule, DropdownModule),
    IconSetService,
    provideAnimations(),
    
  ]
};

