import {booleanAttribute, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {CrudService} from '../../crud-service/crud.service';
import {TitleComponent} from '../title/title.component';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatAnchor} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NgTemplateOutlet} from '@angular/common';
import {AuthService} from '../../auth/service/auth.service';
import {kebabCase, snakeCase} from '../../utils/utils';

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
export class ListComponent<T, D> implements OnInit {
  @Input({required: true}) title!: string;
  @Input({required: true}) service!: CrudService<T, D>;
  @Input() itemTemplate!: TemplateRef<{ $implicit: T, onDelete: (id: number) => void }>;
  @Input({required: true}) entityName!: string;
  @Input({transform: booleanAttribute}) femenino: boolean = false;
  @Input() gridCols: string = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  items: T[] = [];
  error = false;
  loading = true;

  protected creationUrl = '';
  protected creationPermission = '';

  constructor(protected authService: AuthService) {
  }

  ngOnInit(): void {
    this.service.getAll().subscribe({
      next: (data) => (this.items = data ?? []),
      error: (error) => {
        console.error(`Error al obtener ${(this.femenino ? 'las' : 'los') + this.title}`, error);
        this.error = true;
      },
      complete: () => (this.loading = false),
    });

    this.creationUrl = `/${kebabCase(this.entityName)}/create`;
    this.creationPermission = `crear_${snakeCase(this.entityName)}`;
  }

  handleDelete(id: number) {
    this.items = this.items.filter((item: any) => item.id !== id);
  }
}
