import {booleanAttribute, Component, EventEmitter, Input, numberAttribute, OnInit, Output} from '@angular/core';
import {MatCardActions} from '@angular/material/card';
import {AuthService} from '../../auth/service/auth.service';
import {MatAnchor, MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {kebabCase, snakeCase} from '../../utils/utils';

@Component({
  selector: 'app-entity-card-actions',
  imports: [
    MatCardActions,
    MatAnchor,
    RouterLink,
    MatButton
  ],
  templateUrl: './entity-card-actions.component.html',
  standalone: true
})
export class EntityCardActionsComponent implements OnInit {
  @Input({required: true, transform: booleanAttribute}) showButtons!: boolean;
  @Input({required: true}) entityName!: string;
  @Input({required: true, transform: numberAttribute}) editId!: number;

  @Output() deleteClick = new EventEmitter<void>();

  protected puedeEditar;
  protected puedeEliminar;

  protected editUrl = '';
  protected entityPermissionName = '';

  constructor(protected authService: AuthService) {
    this.puedeEditar = authService.hasPermission(`editar_${this.entityPermissionName}`);
    this.puedeEliminar = authService.hasPermission(`eliminar_${this.entityPermissionName}`);
  }

  ngOnInit(): void {
    this.editUrl = `/${kebabCase(this.entityName)}/edit`;
    this.entityPermissionName = snakeCase(this.entityName);
  }
}
