import {Component} from '@angular/core';
import {SugerenciaListComponent} from '../list/sugerencia-list.component';

@Component({
    selector: 'app-buzon',
    imports: [
        SugerenciaListComponent
    ],
    templateUrl: './buzon.component.html',
    standalone: true,
})
export class BuzonComponent {
}
