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
      const authHeader = token.startsWith('Bearer ') ? token : `Bearer ${token}`;

      authReq = req.clone({
        setHeaders: {
          Authorization: authHeader,
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
        }
        return throwError(() => error);
      })
    );
  }
}
