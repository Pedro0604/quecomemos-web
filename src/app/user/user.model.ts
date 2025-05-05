import {RoleName, RolResponseDTO} from '../rol/rol.model';
import {Permiso} from '../permiso/permiso.model';

export interface User {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  urlImagen: string | null;
}

export interface ClientDTO {
  dni: string,
  nombre: string,
  apellido: string,
  urlImagen: string,
  email: string,
  clave: string
}

export interface ClientResponseDTO {
  id: number;
  dni: number;
  nombre: string;
  apellido: string;
  urlImagen: string;
  rol: RolResponseDTO;
}

export interface LoggedUser {
  id: string;
  nombre: string;
  imagen: string;
  rolName: RoleName,
  permisos: Permiso[];
}

export interface Credenciales {
  dni: string,
  clave: string
}
