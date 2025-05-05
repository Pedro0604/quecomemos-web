import {Accion} from './accion';

export interface PermissionResult {
  allowed: boolean;
  reason?: string;
}

export interface PermissionAware<T> {
  data: T;
  permisos: Partial<Record<Accion, PermissionResult>>;
}
