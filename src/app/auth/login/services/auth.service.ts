import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {jwtDecode, JwtPayload} from 'jwt-decode';
import {NotificationService} from '../../../notification/notification.service';
import {Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userLoggedIn = new BehaviorSubject<boolean>(false);
  private apiUrl = "http://localhost:8080";

  isLoggedIn$ = this.userLoggedIn.asObservable();

  constructor(private router: Router, private notificationService: NotificationService, private http: HttpClient) {
  }

  login(token: string) {
    if (this.userLoggedIn.getValue()){
      return;
    }

    localStorage.setItem('authToken', token);
    this.userLoggedIn.next(true);
  }

  logout() {
    if (!this.userLoggedIn.getValue()) {
      return;
    }
    localStorage.removeItem('authToken');

    this.notificationService.show('Sesión cerrada');

    this.userLoggedIn.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    const token = localStorage.getItem('authToken');

    if (!token) {
      this.logout();
      return false;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);

      if (decoded.exp && decoded.exp * 1000 >= Date.now()) {
        this.login(token);
        return true;
      } else {
        this.logout();
        return false;
      }
    } catch (error) {
      this.logout();
      console.error('Error decoding token:', error);
      return false;
    }
  }

  authenticate(role: 'clientes' | 'responsables' | 'administradores', credenciales: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/${role}/autenticacion`, credenciales, { observe: 'response' });
  }

  getUserId(): string | null {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const decoded = jwtDecode<{ sub: string }>(token);
      return decoded.sub;
    } catch (error) {
      console.error('Error decoding user token:', error);
      return null;
    }
  }

  getUserImg(role: 'clientes' | 'responsables' | 'administradores'): Observable<string> {
    const token = localStorage.getItem('authToken');
    const defaultImg = 'public/Sample_User_Icon.png'; // Imagen por defecto en caso de error

    if (!token) return of(defaultImg); // Devuelve un observable con la imagen por defecto

    try {
      const decoded = jwtDecode<{ sub: string }>(token);
      const userId = decoded.sub;

      return this.http.get<{ urlImagen: string }>(`${this.apiUrl}/${role}/${userId}`).pipe(
        map(user => user.urlImagen || defaultImg), // Devuelve la imagen o la imagen por defecto
        catchError(() => of(defaultImg)) // Si hay error, devuelve la imagen por defecto
      );
    } catch (error) {
      console.error('Error decoding user token:', error);
      return of(defaultImg);
    }
  }

}
