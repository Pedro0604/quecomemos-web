import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {environment} from '../../environments/environment';
import {Deletable} from './Deletable';
import {Entidad, getEntidadLink} from '../permiso/entidad';
import {PermissionAware} from '../permiso/permissionAware';

@Injectable({
  providedIn: 'root'
})
export abstract class CrudService<T, D> implements Deletable {
  protected apiUrl: string;

  protected constructor(protected http: HttpClient, entidad: Entidad) {
    this.apiUrl = `${environment.apiBaseUrl}/${getEntidadLink(entidad)}`;
  }

  getAll(): Observable<PermissionAware<T>[]> {
    return this.http.get<PermissionAware<T>[]>(this.apiUrl);
  }

  getById(id: number | string): Observable<PermissionAware<T>> {
    return this.http.get<PermissionAware<T>>(`${this.apiUrl}/${id}`);
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
