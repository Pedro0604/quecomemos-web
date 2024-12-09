import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {LayoutService} from '../layout/layout.service';
import {MenuComponent} from '../menu/menu.component';
import {Menu} from '../menu/menu.model';
import {TipoComida} from '../comida/comida.model';
import {MenuService} from '../menu/menu.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-menu-list',
  imports: [
    MatIcon,
    MenuComponent,
    MatProgressSpinner
  ],
  templateUrl: './menu-list.component.html',
  standalone: true,
  styleUrl: './menu-list.component.css',
})

export class MenuListComponent implements AfterViewInit, OnInit {
  menus: Menu[] = [];

  ordenComidas: TipoComida[] = ['ENTRADA', 'PLATO_PRINCIPAL', 'POSTRE', 'BEBIDA'];

  error = false;
  loading = true;

  constructor(private layoutService: LayoutService, private menuService: MenuService) {
    this.menus.forEach(menu => {
      menu.comidas.sort((a, b) => {
        return this.ordenComidas.indexOf(a.tipoComida) - this.ordenComidas.indexOf(b.tipoComida);
      });
    });
  }

  ngOnInit(): void {
    this.menuService.getMenus().subscribe({
      next: (data) => {
        this.menus = data;
      },
      error: (error) => {
        console.error('Error al obtener los menús', error);
        this.error = true;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Todos los menús');
    this.layoutService.setExtra(this.extraTemplate);
  }
}
