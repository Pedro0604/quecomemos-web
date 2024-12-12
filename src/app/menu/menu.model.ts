import {Comida} from '../comida/comida.model';

export type Menu = {
  id: number;
  nombre: string;
  precio: number;
  vegetariano: boolean;
  comidas: Comida[];
}

export type MenuDTO = {
  nombre: string;
  precio: number;
  vegetariano: boolean;
  comidaIds: number[];
}
