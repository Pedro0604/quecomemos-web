import {capitalize} from '../utils/utils';
import {ClientResponseDTO} from '../user/user.model';

export type TipoSugerencia = 'ALIMENTOS' | 'INFRAESTRUCTURA' | 'ATENCION' | 'OTROS';

export function tipoSugerenciaToString(value: TipoSugerencia): string {
  return capitalize(value.replace('_', ' '));
}

export interface Sugerencia {
  id: number;
  descripcion: string;
  tipo: TipoSugerencia;
  fecha: Date;
  cliente: ClientResponseDTO;
}

export interface SugerenciaDTO {
  descripcion: string;
  tipo: TipoSugerencia;
}

