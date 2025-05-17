import {Component} from '@angular/core';
import {ResponsableService} from '../service/responsable.service';
import {ListComponent} from '../../components/list/list.component';
import {Entidad} from '../../permiso/entidad';
import {ResponsableComponent} from '../component/responsable.component';

@Component({
  selector: 'app-responsable-list',
  imports: [
    ListComponent,
    ResponsableComponent
  ],
  templateUrl: './responsable-list.component.html',
  standalone: true,
})
export class ResponsableListComponent {
  constructor(protected responsableService: ResponsableService) {
  }

  protected fetchItems = () => this.responsableService.getAll();
  protected readonly Entidad = Entidad;
}
