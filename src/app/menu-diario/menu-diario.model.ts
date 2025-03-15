import {Menu} from '../menu/menu.model';

export type DiasSemana = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';

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
  }
}

export const diasSemanaArray: DiasSemana[] = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

export type MenuDiario = {
  id: number;
  dia: DiasSemana;
  menuVegetariano: Menu;
  menuNoVegetariano: Menu;
}

export type MenuDiarioDTO = {
  dia: DiasSemana;
  menuVegetarianoId: number;
  menuNoVegetarianoId: number;
}
