import {Comida} from '../comida/comida.model';
import {PermissionAware} from '../permiso/permissionAware';

export type Menu = {
  id: number;
  nombre: string;
  precio: number;
  vegetariano: boolean;
  comidas: PermissionAware<Comida>[];
}

export type MenuDTO = {
  nombre: string;
  precio: number;
  vegetariano: boolean;
  comidaIds: number[];
}
