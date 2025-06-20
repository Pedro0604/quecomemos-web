import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('authToken');
    // Header para evitar la redirección automática dependiendo de tipo de error
    const skipRedirect = req.headers.get('X-Skip-Auth-Redirect');

    let authReq = req;
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (!skipRedirect) {
          if (error.status === 401) {
            this.router.navigate(['/login']);
          }
          if (error.status === 403) {
            this.router.navigate(['/forbidden']);
          }
          if (error.status === 404) {
            this.router.navigate(['/not-found']);
          }
        }
        return throwError(() => error);
      })
    );
  }
}
