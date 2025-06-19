import {Entidad} from '../permiso/entidad';

export interface RolResponseDTO {
    id: number;
    nombre: RoleName;
}

export type RoleName = Entidad.CLIENTE | Entidad.RESPONSABLE_DE_TURNO | Entidad.ADMINISTRADOR;
