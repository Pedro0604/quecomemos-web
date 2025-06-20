import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Entidad, getEntidadLink} from '../../permiso/entidad';
import {BehaviorSubject, firstValueFrom, Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Pedido} from '../pedido.model';
import {ItemPedidoDTO} from '../item-pedido.model';
import {NotificationService} from '../../notification/notification.service';
import {AuthService} from '../../auth/service/auth.service';
import {Accion} from '../../permiso/accion';
import {PermissionAware} from '../../permiso/permissionAware';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  protected apiUrl: string;
  protected apiUrlItems: string;

  private carritoSubject = new BehaviorSubject<Pedido | null>(null);
  carrito$ = this.carritoSubject.asObservable();

  async refreshCarrito(): Promise<void> {
    try {
      const carrito = await firstValueFrom(this.getCarrito());
      this.carritoSubject.next(carrito);
    } catch {
      this.carritoSubject.next(null);
      this.notificationService.show('Error al cargar el carrito');
    }
  }

  constructor(protected http: HttpClient, private notificationService: NotificationService, authService: AuthService) {
    this.apiUrl = `${environment.apiBaseUrl}/${getEntidadLink(Entidad.PEDIDO)}`;
    this.apiUrlItems = `${environment.apiBaseUrl}/${getEntidadLink(Entidad.ITEM_PEDIDO)}`;

    authService.usuario$.subscribe(() => {
      if (authService.isLoggedIn && authService.hasPermission(Accion.VER_CARRITO, Entidad.CLIENTE)) {
        this.refreshCarrito();
      }
    });
  }

  getPedidos(): Observable<PermissionAware<Pedido>[]> {
    return this.http.get<PermissionAware<Pedido>[]>(`${this.apiUrl}/`);
  }

  getMisPedidos(): Observable<PermissionAware<Pedido>[]> {
    return this.http.get<PermissionAware<Pedido>[]>(`${this.apiUrl}/mis-pedidos`);
  }

  private getCarrito(): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/carrito`);
  }

  async addItem(entity: ItemPedidoDTO): Promise<void> {
    await firstValueFrom(this.http.put<void>(`${this.apiUrl}/add`, entity));
    await this.refreshCarrito();
  }

  async clearCarrito(): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrl}/`));
    await this.refreshCarrito();
  }

  async updateItemQuantity(id: number | string, cantidad: number): Promise<void> {
    await firstValueFrom(this.http.put<void>(`${this.apiUrlItems}/${id}`, cantidad));
    await this.refreshCarrito();
  }

  async removeItem(id: number | string): Promise<void> {
    await firstValueFrom(this.http.delete<void>(`${this.apiUrlItems}/${id}`));
    await this.refreshCarrito();
  }

  getPedidoById(id: number | string): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/${id}`);
  }

  marcarComoEntregado(id: number | string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/entregar`, {});
  }
}
