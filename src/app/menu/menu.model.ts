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

export type MenuFormData = {
  nombre: string,
  precio: number,
  vegetariano: boolean,
  entrada: Comida | null,
  principal: Comida | null,
  postre: Comida | null,
  bebida: Comida | null,
}
