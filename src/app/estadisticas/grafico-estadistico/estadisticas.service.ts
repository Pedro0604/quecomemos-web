import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  private baseUrl = environment.apiBaseUrl + '/estadisticas';

  constructor(private http: HttpClient) {}

  getEstadisticas(): Observable<{ [key: string]: { labels: string[], data: number[] } }> {
    return this.http.get<{ [key: string]: { labels: string[], data: number[] } }>(`${this.baseUrl}`);
  }

}
