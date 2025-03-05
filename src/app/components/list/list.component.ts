import {AfterViewInit, booleanAttribute, Component, Input, OnInit, TemplateRef} from '@angular/core';
import {CrudService} from '../../crud-service/crud.service';
import {TitleExtraComponent} from '../title-extra/title-extra.component';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatAnchor} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {NgTemplateOutlet} from '@angular/common';
import {LayoutService} from '../../layout/layout.service';
import {capitalize} from '../../utils/utils';

@Component({
  selector: 'app-list',
  imports: [
    TitleExtraComponent,
    MatIcon,
    MatProgressSpinner,
    MatAnchor,
    RouterLink,
    NgTemplateOutlet
  ],
  templateUrl: './list.component.html',
  standalone: true
})
export class ListComponent<T, D> implements AfterViewInit, OnInit {
  @Input({required: true}) title!: string;
  @Input({required: true}) service!: CrudService<T, D>;
  @Input() itemTemplate!: TemplateRef<{ $implicit: T, onDelete: (id: number) => void }>;
  @Input({required: true}) creationLink: string = '';
  @Input({transform: booleanAttribute}) femenino: boolean = false;
  @Input() gridCols: string = "grid-cols-1 md:grid-cols-2 xl:grid-cols-3";

  items: T[] = [];
  error = false;
  loading = true;

  constructor(private layoutService: LayoutService) {
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
  }

  ngAfterViewInit(): void {
    this.layoutService.setTitle(capitalize(this.title));
  }

  handleDelete(id: number) {
    this.items = this.items.filter((item: any) => item.id !== id);
  }
}
