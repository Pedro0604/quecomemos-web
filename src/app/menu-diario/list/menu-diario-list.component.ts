import {Component} from '@angular/core';
import {MenuDiarioService} from '../service/menu-diario.service';
import {MenuDiarioComponent} from '../component/menu-diario.component';
import {ListComponent} from '../../components/list/list.component';

import {Entidad} from '../../permiso/entidad';

@Component({
  selector: 'app-menu-diario-list',
  imports: [
    MenuDiarioComponent,
    ListComponent,
  ],
  templateUrl: './menu-diario-list.component.html',
  standalone: true,
})
export class MenuDiarioListComponent {
  constructor(protected menuDiarioService: MenuDiarioService) {
  }

  protected fetchItems = () => this.menuDiarioService.getAll();
  protected readonly Entidad = Entidad;
}
