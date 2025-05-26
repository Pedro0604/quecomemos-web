export type MetodoDePago = 'CREDITO' | 'EFECTIVO' | 'DEBITO' | 'MERCADO_PAGO' | 'CUENTA_DNI';

export interface Pago {
  metodoPago: MetodoDePago
}
