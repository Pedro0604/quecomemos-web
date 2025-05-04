import {Component} from '@angular/core';
import {MenuComponent} from '../component/menu.component';
import {MenuService} from '../service/menu.service';
import {ListComponent} from '../../components/list/list.component';

@Component({
  selector: 'app-menu-list',
  imports: [
    MenuComponent,
    ListComponent
  ],
  templateUrl: './menu-list.component.html',
  standalone: true,
})

export class MenuListComponent {
  constructor(protected menuService: MenuService) {
  }

  protected fetchItems = () => this.menuService.getAll();
}
