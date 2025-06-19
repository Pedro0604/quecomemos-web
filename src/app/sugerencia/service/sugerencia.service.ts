import {Injectable} from '@angular/core';
import {CrudService} from '../../crud-service/crud.service';
import {Sugerencia, SugerenciaDTO} from '../sugerencia.model';
import {HttpClient} from '@angular/common/http';
import {Entidad} from '../../permiso/entidad';

@Injectable({
  providedIn: 'root'
})
export class SugerenciaService extends CrudService<Sugerencia, SugerenciaDTO> {
  constructor(http: HttpClient) {
    super(http, Entidad.SUGERENCIA);
  }
}
