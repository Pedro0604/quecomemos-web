import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Comida, ComidaDTO} from '../comida.model';
import {CrudService} from '../../crud-service/crud.service';
import {Entidad} from '../../permiso/entidad';

@Injectable({
  providedIn: 'root'
})
export class ComidaService extends CrudService<Comida, ComidaDTO> {
  constructor(http: HttpClient) {
    super(http, Entidad.COMIDA);
  }
}
