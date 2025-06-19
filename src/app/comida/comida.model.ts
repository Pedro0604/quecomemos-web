import {capitalize} from '../utils/utils';

export type TipoComida = 'OTRO' | 'POSTRE' | 'ENTRADA' | 'BEBIDA' | 'PLATO_PRINCIPAL';

export function tipoComidaToString(value: TipoComida): string {
    return capitalize(value.replace('_', ' '));
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
