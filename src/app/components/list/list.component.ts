import {booleanAttribute, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {TitleComponent} from '../title/title.component';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatAnchor} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NgTemplateOutlet} from '@angular/common';
import {AuthService} from '../../auth/service/auth.service';
import {Observable} from 'rxjs';
import {Entidad, entidadIsFemenina, getEntidadLink, getEntidadNombrePlural} from '../../permiso/entidad';
import {Accion} from '../../permiso/accion';
import {PermissionAware, PermissionResult} from '../../permiso/permissionAware';

@Component({
  selector: 'app-list',
  imports: [
    TitleComponent,
    MatIcon,
    MatProgressSpinner,
    MatAnchor,
    RouterLink,
    NgTemplateOutlet
  ],
  templateUrl: './list.component.html',
  standalone: true
})
export class ListComponent<T> implements OnInit {
  @Input({required: true}) fetchItems!: () => Observable<PermissionAware<T>[]>;
  @Input() itemTemplate!: TemplateRef<{
    $implicit: T,
    onDelete: (id: number) => void,
    permisos: Partial<Record<Accion, PermissionResult>>
  }>;
  @Input({required: true}) entity!: Entidad;
  @Input() gridCols: string = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";
  @Input({transform: booleanAttribute}) showVegetariano: boolean = true;

  items: PermissionAware<T>[] = [];
  error = false;
  loading = true;

  protected creationUrl = '';
  protected canCreate: boolean = false;
  protected title: string = "";
  protected esFemenino: boolean = false;

  constructor(protected authService: AuthService) {
  }

  ngOnInit(): void {
    this.title = getEntidadNombrePlural(this.entity);
    this.esFemenino = entidadIsFemenina(this.entity);

    this.fetchItems().subscribe({
      next: (data) => (this.items = data ?? []),
      error: (error) => {
        console.error(`Error al obtener ${(this.esFemenino ? 'las ' : 'los ') + this.title}`, error);
        this.error = true;
      },
      complete: () => (this.loading = false),
    });

    this.creationUrl = `/${getEntidadLink(this.entity)}/create`;
    this.canCreate = this.authService.hasPermission(Accion.CREAR, this.entity);
  }

  handleDelete(id: number) {
    this.items = this.items.filter((item: any) => item.id !== id);
  }
}
