import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {AuthInterceptor} from './app/interceptors/auth-interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(appRoutes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
}).catch((err) => console.error(err));
