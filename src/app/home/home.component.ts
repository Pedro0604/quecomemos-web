import {Component, TemplateRef, ViewChild} from '@angular/core';
import {MatAnchor} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MenuDiarioComponent} from "../menu-diario/component/menu-diario.component";
import {RouterLink} from "@angular/router";
import {MenuDiario} from '../menu-diario/menu-diario.model';
import {LayoutService} from '../layout/layout.service';
import {MenuDiarioService} from '../menu-diario/service/menu-diario.service';

@Component({
  selector: 'app-home',
    imports: [
        MatAnchor,
        MatIcon,
        MatProgressSpinner,
        MenuDiarioComponent,
        RouterLink
    ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  menusDiarios: MenuDiario[] = [];

  error = false;
  loading = true;

  constructor(private layoutService: LayoutService, private menuDiarioService: MenuDiarioService) {
  }

  ngOnInit(): void {
    this.menuDiarioService.getMenusDiariosSemanal().subscribe({
      next: (data) => {
        this.menusDiarios = data ?? [];
      },
      error: (error) => {
        console.error('Error al obtener el menu semanal', error);
        this.error = true;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Menú semanal');
    this.layoutService.setExtra(this.extraTemplate);
  }
}
