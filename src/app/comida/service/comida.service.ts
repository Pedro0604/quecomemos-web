import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Comida, ComidaDTO} from '../comida.model';
import {CrudService} from '../../crud-service/crud.service';

@Injectable({
  providedIn: 'root'
})
export class ComidaService extends CrudService<Comida, ComidaDTO> {
  constructor(http: HttpClient) {
    super(http, 'comidas');
  }
}
