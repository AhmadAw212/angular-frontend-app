import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routes } from './app.routes';
import {
  errorInterceptor,
  loadingInterceptor,
  apiKeyInterceptor,
} from './core/interceptors';
import { MessageService } from 'primeng/api';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    provideHttpClient(
      withFetch(),
      withInterceptors([
        loadingInterceptor,
        errorInterceptor,
        apiKeyInterceptor,
      ])
    ),
    provideAnimations(),
    MessageService,
  ],
};
