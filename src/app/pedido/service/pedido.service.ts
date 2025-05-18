import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Entidad, getEntidadLink} from '../../permiso/entidad';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Pedido} from '../pedido.model';
import {ItemPedidoDTO} from '../../item-pedido/item-pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  protected apiUrl: string;

  constructor(protected http: HttpClient) {
    this.apiUrl = `${environment.apiBaseUrl}/${getEntidadLink(Entidad.PEDIDO)}`;
  }

  getPedidosDeCliente(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.apiUrl}/`);
  }

  getCarrito(): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.apiUrl}/carrito`);
  }

  addItem(entity: ItemPedidoDTO): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/add`, entity);
  }

  clearCarrito(): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/`);
  }
}
