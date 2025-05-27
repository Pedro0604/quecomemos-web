import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {jwtDecode} from 'jwt-decode';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ClientDTO, Credenciales, LoggedUser} from '../../user/user.model';
import {environment} from '../../../environments/environment';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {NotificationService} from '../../notification/notification.service';
import {capitalize} from '../../utils/utils';
import {RoleName} from "../../rol/rol.model";
import {Permiso} from '../../permiso/permiso.model';
import {Entidad} from '../../permiso/entidad';
import {Accion} from '../../permiso/accion';

interface CustomJwtPayload {
    sub: string,
    nombre: string,
    imagen: string,
    rolName: RoleName,
    permisos: Permiso[],
    exp: number
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private usuarioSubject = new BehaviorSubject<LoggedUser | null>(null);
    usuario$ = this.usuarioSubject.asObservable();

    private apiUrl = environment.apiBaseUrl;
    private tokenKey = 'authToken';

    constructor(private notificationService: NotificationService, private router: Router, private http: HttpClient) {
        this.initFromLocalStorage();
    }

    get usuario(): LoggedUser | null {
        return this.usuarioSubject.getValue();
    }

    get isLoggedIn(): boolean {
        return !!this.usuario;
    }

    login(token: string) {
        this.setUserFromToken(token);
        this.notificationService.show(`${capitalize(this.usuario?.rolName ?? 'Usuario')} autenticado correctamente`);
        this.router.navigate(['/carta']);
    }

    logout() {
        localStorage.removeItem(this.tokenKey);
        this.usuarioSubject.next(null);

        this.notificationService.show('Sesión cerrada');
        this.router.navigate(['/login']);
    }

    hasPermission(accion: Accion, entidad: Entidad): boolean {
        return this.usuario?.permisos.some(p => p.accion === accion && p.entidad === entidad) ?? false;
    }

    canAccessRoute(route: ActivatedRouteSnapshot): boolean {
        if (route.data?.['permiso']) {
            return this.hasPermission(route.data['permiso'].accion as Accion, route.data['permiso'].entidad as Entidad);
        }
        return true;
    }

    refreshUserToken() {
        this.http.post<any>(`${this.apiUrl}/auth/refresh`, {}, {observe: "response"}).subscribe({
            next: response => {
                const token = response?.headers?.get('Authorization');
                if (token) {
                    this.setUserFromToken(token);
                } else {
                    console.error('No se recibió token al refrescar');
                }
            },
            error: err => {
                console.error('Error al refrescar token', err);
            }
        });
    }

    authenticate(credenciales: Credenciales, headers: HttpHeaders = new HttpHeaders()): Observable<any> {
        return this.http.post(`${this.apiUrl}/auth`, credenciales, {observe: 'response', headers: headers});
    }

    registerClient(clientData: ClientDTO): Observable<any> {
        return this.http.post(`${this.apiUrl}/${Entidad.CLIENTE}`, clientData, {observe: 'response'});
    }

    private initFromLocalStorage() {
        const token = localStorage.getItem(this.tokenKey);
        if (token && this.isTokenValid(token)) {
            this.setUserFromToken(token);
        }
    }

    public isTokenValid(token: string): boolean {
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

            const usuario: LoggedUser = {
                id: decoded.sub,
                nombre: decoded.nombre ?? 'Usuario',
                imagen: decoded.imagen ?? 'Sample_User_Icon.png',
                rolName: decoded.rolName ? decoded.rolName as RoleName : Entidad.CLIENTE,
                permisos: decoded.permisos ?? [],
            };

            localStorage.setItem(this.tokenKey, token);
            this.usuarioSubject.next(usuario);
        } catch (error) {
            console.error('Error decoding token:', error);
            this.logout();
        }
    }
}
