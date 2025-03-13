export interface User {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  urlImagen: string | null;
  clave: string;
}

export interface UserDTO {
  nombre: string;
  apellido: string;
  email: string;
  urlImagen: string | null;
  clave: string;
}

export interface UserRegisterDTO {
  dni: string,
  nombre: string,
  apellido: string,
  urlImagen: string,
  email: string,
  clave: string
}

export interface UsuarioLogueado {
  id: string;
  nombre: string;
  imagen: string;
  rol: Role;
  permisos: string[];
}

export type Role = 'clientes' | 'responsables' | 'administradores';
export interface Credenciales { dni: string, clave: string }
