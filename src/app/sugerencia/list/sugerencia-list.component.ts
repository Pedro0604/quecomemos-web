import {Component} from '@angular/core';
import {SugerenciaService} from '../service/sugerencia.service';
import {ListComponent} from '../../components/list/list.component';
import {SugerenciaComponent} from '../component/sugerencia.component';

@Component({
  selector: 'app-sugerencia-list',
  imports: [
    ListComponent,
    SugerenciaComponent
  ],
  templateUrl: './sugerencia-list.component.html'
})
export class SugerenciaListComponent {
  constructor(protected sugerenciaService: SugerenciaService) {
  }
}
