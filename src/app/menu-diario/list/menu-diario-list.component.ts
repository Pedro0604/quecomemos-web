import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MenuDiario} from '../menu-diario.model';
import {LayoutService} from '../../layout/layout.service';
import {MenuDiarioService} from '../service/menu-diario.service';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MenuDiarioComponent} from '../component/menu-diario.component';
import {MatAnchor} from '@angular/material/button';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-menu-diario-list',
  imports: [
    MatIcon,
    MatProgressSpinner,
    MenuDiarioComponent,
    MatAnchor,
    RouterLink
  ],
  templateUrl: './menu-diario-list.component.html',
  standalone: true,
  styleUrl: './menu-diario-list.component.css'
})
export class MenuDiarioListComponent implements AfterViewInit, OnInit {
  menusDiarios: MenuDiario[] = [];

  error = false;
  loading = true;

  constructor(private layoutService: LayoutService, private menuDiarioService: MenuDiarioService) {
  }

  ngOnInit(): void {
    this.menuDiarioService.getMenusDiarios().subscribe({
      next: (data) => {
        this.menusDiarios = data ?? [];
      },
      error: (error) => {
        console.error('Error al obtener los menús diarios', error);
        this.error = true;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Menús diarios');
    this.layoutService.setExtra(this.extraTemplate);
  }

  handleDeleteMenu(id: number) {
    this.menusDiarios = this.menusDiarios.filter(menu => menu.id !== id);
  }
}
