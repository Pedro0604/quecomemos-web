export type User = {
  id: number;
  nombre: string;
  apellido: string;
  dni: number;
  email: string;
  urlImagen: string | null;
  clave: string;
}

export type UserDTO = {
  nombre: string;
  apellido: string;
  email: string;
  urlImagen: string | null;
  clave: string;
}
