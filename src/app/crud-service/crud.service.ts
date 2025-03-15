import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Deletable} from './Deletable';

@Injectable({
  providedIn: 'root'
})
export abstract class CrudService<T, D> implements Deletable {
  protected apiUrl: string;

  protected constructor(protected http: HttpClient, endpoint: string) {
    this.apiUrl = `${environment.apiBaseUrl}/${endpoint}`;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(this.apiUrl);
  }

  getById(id: number | string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}/${id}`);
  }

  create(entity: D, headers: HttpHeaders = new HttpHeaders()): Observable<T> {
    return this.http.post<T>(this.apiUrl, entity, {headers});
  }

  update(id: number | string, entity: D, headers: HttpHeaders = new HttpHeaders()): Observable<T> {
    return this.http.put<T>(`${this.apiUrl}/${id}`, entity, {headers});
  }

  delete(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
