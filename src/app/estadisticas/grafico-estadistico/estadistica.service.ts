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

  getEstadisticaPorIdConFiltro(
    id: string,
    fechaDesde?: string,
    fechaHasta?: string
  ): Observable<{ labels: string[]; data: number[] }> {
    const params: any = {};
    if (fechaDesde) params.fechaDesde = fechaDesde;
    if (fechaHasta) params.fechaHasta = fechaHasta;
    return this.http.get<{ labels: string[]; data: number[] }>(`${this.apiUrl}/${id}`, { params });
  }

  getResumenEstadisticas(periodo: 'diario' | 'semanal' | 'mensual') {
    return this.http.get<{
      menusVendidos: number;
      comidasVendidas: number;
      dineroRecaudado: number;
    }>(`${this.apiUrl}/resumen`, {
      params: { periodo }
    });
  }


}
