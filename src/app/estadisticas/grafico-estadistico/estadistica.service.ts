import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {Entidad, getEntidadLink} from '../../permiso/entidad';

@Injectable({
  providedIn: 'root'
})
export class EstadisticaService {
  private apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = `${environment.apiBaseUrl}/${getEntidadLink(Entidad.ESTADISTICA)}`;
  }

  getEstadisticaPorId(id: string): Observable<{ labels: string[], data: number[] }> {
    return this.http.get<{ labels: string[], data: number[] }>(`${this.apiUrl}/${id}`);
  }


}
