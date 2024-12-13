import {Menu} from '../menu/menu.model';

export type diasSemana = 'MONDAY' | 'TUESDAY' | 'WEDNESDAY' | 'THURSDAY' | 'FRIDAY';

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
