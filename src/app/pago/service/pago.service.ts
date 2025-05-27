import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Entidad, getEntidadLink} from '../../permiso/entidad';
import {Pago} from '../pago.model';

@Injectable({
  providedIn: 'root'
})
export class PagoService {
  private readonly apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiBaseUrl}/${getEntidadLink(Entidad.PAGO)}/`;
  }

  create(entity: Pago): Observable<Pago> {
    return this.http.post<Pago>(this.apiUrl, entity);
  }
}
