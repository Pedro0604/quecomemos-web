import {ItemPedido} from './item-pedido.model';

export interface Pedido {
  id: number;
  clienteId: number;
  pagoId: number | null;
  items: ItemPedido[];
  fecha: Date;
  total: number;
}
