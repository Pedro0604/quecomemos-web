import {ItemPedido} from './item-pedido.model';

export interface Pedido {
  id: number;
  clienteId: number;
  pagoId: number | null;
  items: ItemPedido[];
  fecha: String;
  fechaPago: String;
  total: number;
  entregado: boolean;
  qrBase64: string | null;
}
