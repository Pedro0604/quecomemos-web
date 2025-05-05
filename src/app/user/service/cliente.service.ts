import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ClientDTO, User} from '../user.model';
import {CrudService} from '../../crud-service/crud.service';
import {Observable} from 'rxjs';
import {AuthService} from '../../auth/service/auth.service';
import {Sugerencia} from '../../sugerencia/sugerencia.model';
import {Entidad} from '../../permiso/entidad';


@Injectable({
  providedIn: 'root'
})
export class ClienteService extends CrudService<User, ClientDTO> {
  constructor(http: HttpClient, private authService: AuthService) {
    super(http, Entidad.CLIENTE);
  }

  getSugerencias(): Observable<Sugerencia[]> {
    const authId = this.authService.usuario?.id;
    if (!authId) {
      throw new Error('No se ha encontrado el ID del usuario autenticado');
    }
    return this.http.get<Sugerencia[]>(`${this.apiUrl}/${authId}/sugerencias`);
  }
}
