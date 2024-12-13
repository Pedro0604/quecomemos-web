import {Menu} from '../menu/menu.model';

export type diasSemana = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';

export function traduccionDiasSemana(dia: diasSemana): string {
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

export type MenuDiario = {
  id: number;
  dia: diasSemana;
  menuVegetariano: Menu;
  menuNoVegetariano: Menu;
}

export type MenuDiarioDTO = {
  dia: diasSemana;
  menuVegetarianoId: number;
  menuNoVegetarianoId: number;
}
