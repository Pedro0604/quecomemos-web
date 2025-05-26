export type MetodoDePago = 'CREDITO' | 'DEBITO' | 'MERCADO_PAGO' | 'CUENTA_DNI';

export interface Pago {
  metodoPago: MetodoDePago
}
