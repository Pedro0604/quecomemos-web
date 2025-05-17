import {Injectable} from '@angular/core';
import {CrudService} from '../../crud-service/crud.service';
import {HttpClient} from '@angular/common/http';
import {Entidad} from '../../permiso/entidad';
import {Responsable, ResponsableDTO} from '../responsable.model';

@Injectable({
    providedIn: 'root'
})
export class ResponsableService extends CrudService<Responsable, ResponsableDTO> {
    constructor(http: HttpClient) {
        super(http, Entidad.RESPONSABLE_DE_TURNO);
    }
}
