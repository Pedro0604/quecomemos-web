import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Entidad, getEntidadLink} from '../../permiso/entidad';
import {environment} from '../../../environments/environment';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItemPedidoService {
  protected apiUrl: string;

  constructor(protected http: HttpClient) {
    this.apiUrl = `${environment.apiBaseUrl}/${getEntidadLink(Entidad.ITEM_PEDIDO)}`;
  }

  updateCantidad(id: number | string, cantidad: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/add`, cantidad);
  }

  removeItem(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
