export type TipoComida = 'OTRO' | 'POSTRE' | 'ENTRADA' | 'BEBIDA' | 'PLATO_PRINCIPAL';

export function tipoComidaToString(value: TipoComida): string {
  return value.replace('_', ' ').charAt(0).toUpperCase() + value.replace('_', ' ').slice(1).toLowerCase();
}

export type Comida = {
  id: number;
  nombre: string;
  urlImagen: string | null;
  tipoComida: TipoComida;
  precio: number;
  vegetariana: boolean;
}

export type ComidaDTO = {
  nombre: string;
  urlImagen: string | null;
  tipoComida: TipoComida;
  precio: number;
  vegetariana: boolean;
}
