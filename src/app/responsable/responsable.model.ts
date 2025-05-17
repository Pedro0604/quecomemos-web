import {RolResponseDTO} from '../rol/rol.model';
import {capitalize} from '../utils/utils';

export type Turno = 'MAÑANA' | 'TARDE';
export const turnos: Turno[] = ['MAÑANA', 'TARDE'];

export function turnoToString(value: Turno): string {
  return capitalize(value.replace('_', ' '));
}

export interface Responsable {
  id: number;
  dni: number;
  nombre: string;
  apellido: string;
  urlImagen: string;
  rol: RolResponseDTO;
  turno: Turno;
}

export interface ResponsableDTO {
  dni: string,
  nombre: string,
  apellido: string,
  urlImagen: string,
  clave: string,
  turno: Turno,
}
