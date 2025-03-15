export interface User {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  urlImagen: string | null;
  clave: string;
}

export interface ClientDTO {
  dni: string,
  nombre: string,
  apellido: string,
  urlImagen: string,
  email: string,
  clave: string
}

export interface LoggedUser {
  id: string;
  nombre: string;
  imagen: string;
  rolName: RoleName,
  rolApiPath: RoleApiPath;
  permisos: string[];
}

export type RoleName = 'cliente' | 'responsable' | 'administrador';
export type RoleApiPath = 'clientes' | 'responsables' | 'administradores';

export interface Credenciales {
  dni: string,
  clave: string
}
