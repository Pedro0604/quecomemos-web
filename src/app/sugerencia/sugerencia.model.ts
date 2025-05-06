import {capitalize} from '../utils/utils';
import {ClientResponseDTO} from '../user/user.model';
import {PermissionAware} from '../permiso/permissionAware';

export type TipoSugerencia = 'ALIMENTOS' | 'INFRAESTRUCTURA' | 'ATENCION' | 'OTROS';
export const tiposSugerencias: TipoSugerencia[] = ['ALIMENTOS', 'INFRAESTRUCTURA', 'ATENCION', 'OTROS'];

export function tipoSugerenciaToString(value: TipoSugerencia): string {
  if (value === 'ATENCION') {
    return 'Atención';
  }
  return capitalize(value.replace('_', ' '));
}

export interface Sugerencia {
  id: number;
  descripcion: string;
  tipo: TipoSugerencia;
  fecha: Date;
  updatedAt: Date;
  cliente: PermissionAware<ClientResponseDTO>;
}

export interface SugerenciaDTO {
  descripcion: string;
  tipo: TipoSugerencia;
}

