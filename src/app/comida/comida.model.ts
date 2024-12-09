export type TipoComida = 'OTRO' | 'POSTRE' | 'ENTRADA' | 'BEBIDA' | 'PLATO_PRINCIPAL';
export type Comida = {
  id: number;
  nombre: string;
  urlImagen: string | null;
  tipoComida: TipoComida;
  precio: number;
  vegetariana: boolean;
}
