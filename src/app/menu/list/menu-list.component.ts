import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatIcon} from '@angular/material/icon';
import {LayoutService} from '../../layout/layout.service';
import {MenuComponent} from '../component/menu.component';
import {Menu} from '../menu.model';
import {TipoComida} from '../../comida/comida.model';
import {MenuService} from '../service/menu.service';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatAnchor} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {TitleExtraComponent} from '../../components/title-extra/title-extra.component';

@Component({
  selector: 'app-menu-list',
  imports: [
    MatIcon,
    MenuComponent,
    MatProgressSpinner,
    MatAnchor,
    RouterLink,
    TitleExtraComponent
  ],
  templateUrl: './menu-list.component.html',
  standalone: true,
})

export class MenuListComponent implements AfterViewInit, OnInit {
  menus: Menu[] = [];

  ordenComidas: TipoComida[] = ['ENTRADA', 'PLATO_PRINCIPAL', 'POSTRE', 'BEBIDA'];

  error = false;
  loading = true;

  constructor(private layoutService: LayoutService, private menuService: MenuService) {
  }

  ngOnInit(): void {
    this.menuService.getMenus().subscribe({
      next: (data) => {
        this.menus = data ?? [];
        this.menus.forEach(menu => {
          menu.comidas.sort((a, b) => {
            return this.ordenComidas.indexOf(a.tipoComida) - this.ordenComidas.indexOf(b.tipoComida);
          });
        });
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

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Menús');
  }

  handleDeleteMenu(id: number) {
    this.menus = this.menus.filter(menu => menu.id !== id);
  }
}
