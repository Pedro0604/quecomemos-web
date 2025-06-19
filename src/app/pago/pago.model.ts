export type MetodoDePago = 'CREDITO' | 'DEBITO' | 'MERCADO_PAGO' | 'CUENTA_DNI';

export interface PagoDTO {
  metodoPago: MetodoDePago
}

export interface Pago {
  id: number,
  metodoPago: MetodoDePago,
  pedidoId: number,
  fecha: string
}
