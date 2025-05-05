import {Entidad} from './entidad';
import {Accion} from './accion';

export interface Permiso {
  accion: Accion;
  entidad: Entidad;
}

