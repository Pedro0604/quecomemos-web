import {Entidad} from '../permiso/entidad';

export interface Preciable {
    id: number;
    nombre: String;
    tipo: Entidad.MENU | Entidad.COMIDA;
    precio: number;
}

export interface ItemPedido {
    id: number;
    pedidoId: number;
    precioUnitario: number;
    cantidad: number;
    subtotal: number;
    item: Preciable;
    loading: boolean | null;
}

export interface ItemPedidoDTO {
    itemId: number;
    cantidad: number;
}
