import {booleanAttribute, Component, EventEmitter, Input, numberAttribute, OnInit, Output} from '@angular/core';
import {MatCardActions} from '@angular/material/card';
import {AuthService} from '../../auth/service/auth.service';
import {MatAnchor, MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {Entidad, getEntidadLink} from '../../permiso/entidad';
import {Accion} from '../../permiso/accion';
import {PermissionResult} from '../../permiso/permissionAware';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-entity-card-actions',
  imports: [
    MatCardActions,
    MatAnchor,
    RouterLink,
    MatButton,
    MatTooltip
  ],
  templateUrl: './entity-card-actions.component.html',
  standalone: true
})
export class EntityCardActionsComponent implements OnInit {
  @Input({required: true, transform: booleanAttribute}) showButtons!: boolean;
  @Input({required: true}) entity!: Entidad;
  @Input({required: true, transform: numberAttribute}) editId!: number;
  @Input({required: true}) permisos!: Partial<Record<Accion, PermissionResult>>;

  @Output() deleteClick = new EventEmitter<void>();

  protected puedeEditar = false;
  protected puedeEliminar = false;

  protected editUrl = '';

  constructor(protected authService: AuthService) {
  }

  ngOnInit(): void {
    this.editUrl = `/${getEntidadLink(this.entity)}/edit`;
    this.puedeEditar = this.authService.hasPermission(Accion.EDITAR, this.entity);
    this.puedeEliminar = this.authService.hasPermission(Accion.ELIMINAR, this.entity);
  }
}
