import {kebabCase} from '../utils/utils';

export enum Entidad {
  CLIENTE = "cliente",
  RESPONSABLE_DE_TURNO = "responsable",
  ADMINISTRADOR = "admin",
  COMIDA = "comida",
  MENU = "menu",
  ESTADISTICAS = "estadisticas",
  MENU_DIARIO = "menu_diario",
  SUGERENCIA = "sugerencia",
  PEDIDO = "pedido",
  ITEM_PEDIDO = "item_pedido",
  PAGO = "pago"
}

export function getEntidadLink(entidad: Entidad): string {
  return kebabCase(entidad);
}

export function getEntidadNombre(entidad: Entidad): string {
  return entidad.replace(/_/g, ' ').replace('menu', 'menú');
}

export function getEntidadNombrePlural(entidad: Entidad): string {
  switch (entidad) {
    case Entidad.ADMINISTRADOR:
      return 'administradores';
    case Entidad.MENU_DIARIO:
      return 'menús diarios';
    case Entidad.ITEM_PEDIDO:
      return 'items de pedido';
    default:
      return `${getEntidadNombre(entidad)}s`;
  }
}

export function entidadIsFemenina(entidad: Entidad): boolean {
  switch (entidad) {
    case Entidad.COMIDA:
    case Entidad.SUGERENCIA:
      return true;
    default:
      return false;
  }
}
