import {Menu} from '../menu/menu.model';
import {PermissionAware} from '../permiso/permissionAware';

export type DiasSemana = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY' | 'SATURDAY';

export function traduccionDiasSemana(dia: DiasSemana): string {
  switch (dia) {
    case 'MONDAY':
      return 'Lunes';
    case 'TUESDAY':
      return 'Martes';
    case 'WEDNESDAY':
      return 'Miércoles';
    case 'THURSDAY':
      return 'Jueves';
    case 'FRIDAY':
      return 'Viernes';
    case 'SATURDAY':
      return 'Sábado';
  }
}

export function getMenuActual(): DiasSemana {
  const now = new Date();
  const horaActual = now.getHours();
  const dia = now.getDay() - 1; // -1 (domingo) - 5 (sábado)

  if (dia === -1) return 'MONDAY'; // Si es domingo
  if (horaActual < 15) return diasSemanaArray[dia]; // Si es antes de las 15:00, se considera el día actual
  else return diasSemanaArray[(dia + 1) % 7]; // Si es después de las 15:00, se considera el día siguiente
}

export const diasSemanaArray: DiasSemana[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

export type MenuDiario = {
  id: number;
  dia: DiasSemana;
  menuVegetariano: PermissionAware<Menu>;
  menuNoVegetariano: PermissionAware<Menu>;
}

export type MenuDiarioDTO = {
  dia: DiasSemana;
  menuVegetarianoId: number;
  menuNoVegetarianoId: number;
}
