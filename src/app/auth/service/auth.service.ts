import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import {HttpClient} from '@angular/common/http';
import {Credenciales, Role, UserRegisterDTO, UsuarioLogueado} from '../../user/user.model';
import {environment} from '../../../environments/environment';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {capitalize} from '../../utils/utils';

interface CustomJwtPayload {
  sub: string,
  nombre: string,
  imagen: string,
  rol: string,
  permisos: string[],
  exp: number
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private usuarioSubject = new BehaviorSubject<UsuarioLogueado | null>(null);
  usuario$ = this.usuarioSubject.asObservable();

  private apiUrl = environment.apiBaseUrl;
  private tokenKey = 'authToken';

  constructor(private notificationService: NotificationService, private router: Router, private http: HttpClient) {
    this.initFromLocalStorage();
  }

  private initFromLocalStorage() {
    const token = localStorage.getItem(this.tokenKey);
    if (token && this.isTokenValid(token)) {
      this.setUserFromToken(token);
    }
  }

  private isTokenValid(token: string): boolean {
    try {
      const decoded: CustomJwtPayload = jwtDecode(token);
      return decoded.exp * 1000 > Date.now();
    } catch {
      return false;
    }
  }

  private setUserFromToken(token: string) {
    try {
      const decoded: CustomJwtPayload = jwtDecode(token);

      const usuario: UsuarioLogueado = {
        id: decoded.sub,
        nombre: decoded.nombre ?? 'Usuario',
        imagen: decoded.imagen ?? 'Sample_User_Icon.png',
        rol: decoded.rol ? decoded.rol as Role : 'clientes',
        permisos: decoded.permisos ?? [],
      };

      this.usuarioSubject.next(usuario);
      localStorage.setItem(this.tokenKey, token);
    } catch (error) {
      console.error('Error decoding token:', error);
      this.logout();
    }
  }

  login(token: string) {
    this.setUserFromToken(token);
    this.notificationService.show(`${capitalize(this.usuario?.rol ?? 'Usuario')} autenticado correctamente`);
    this.router.navigate(['/carta']);
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this.usuarioSubject.next(null);

    this.notificationService.show('Sesión cerrada');
    this.router.navigate(['/login']);
  }

  get usuario(): UsuarioLogueado | null {
    return this.usuarioSubject.getValue();
  }

  get isLoggedIn(): boolean {
    return !!this.usuario;
  }

  hasPermission(permiso: string): boolean {
    return this.usuario?.permisos.includes(permiso) ?? false;
  }

  canAccessRoute(route: ActivatedRouteSnapshot): boolean {
    if (route.data?.['permiso']) {
      return this.hasPermission(route.data['permiso']);
    }
    return true;
  }

  authenticate(role: Role, credenciales: Credenciales): Observable<any> {
    return this.http.post(`${this.apiUrl}/${role}/autenticacion`, credenciales, {observe: 'response'});
  }

  register(role: Role, userData: UserRegisterDTO): Observable<any> {
    return this.http.post(`${this.apiUrl}/${role}`, userData, {observe: 'response'});
  }
}
