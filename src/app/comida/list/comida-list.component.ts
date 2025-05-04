import {Component} from '@angular/core';
import {ComidaService} from '../service/comida.service';
import {ComidaComponent} from '../component/comida.component';
import {ListComponent} from '../../components/list/list.component';

@Component({
  selector: 'app-comida-list',
  imports: [
    ComidaComponent,
    ListComponent,
  ],
  templateUrl: './comida-list.component.html',
  standalone: true,
})

export class ComidaListComponent {
  constructor(protected comidaService: ComidaService) {
  }

  protected fetchItems = () => this.comidaService.getAll();
}
