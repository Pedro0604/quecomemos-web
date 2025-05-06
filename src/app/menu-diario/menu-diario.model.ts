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
