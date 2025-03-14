import {booleanAttribute, Component, EventEmitter, Input, numberAttribute, Output} from '@angular/core';
import {MatCardActions} from '@angular/material/card';
import {AuthService} from '../../auth/service/auth.service';
import {MatAnchor, MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

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
export class EntityCardActionsComponent {
  @Input({required: true, transform: booleanAttribute}) showButtons!: boolean;
  @Input({required: true}) entityName!: string;
  @Input({required: true}) editUrl!: string;
  @Input({required: true, transform: numberAttribute}) editId!: number;

  @Output() deleteClick = new EventEmitter<void>();

  protected puedeEditar;
  protected puedeEliminar;

  constructor(protected authService: AuthService) {
    this.puedeEditar = authService.hasPermission(`editar_${this.entityName}`);
    this.puedeEliminar = authService.hasPermission(`eliminar_${this.entityName}`);
  }
}
