export interface RolResponseDTO {
  id: number;
  nombre: RoleName;
}

export type RoleName = 'cliente' | 'responsable' | 'administrador';
export type RoleApiPath = 'clientes' | 'responsables' | 'administradores';
