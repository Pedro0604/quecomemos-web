import {Component, EventEmitter, Input, Output} from '@angular/core';
import {MatIconButton} from '@angular/material/button';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
    selector: 'app-cantidad',
    imports: [
        MatIconButton,
        MatIcon,
        MatProgressSpinner,
        MatTooltip
    ],
    templateUrl: './cantidad.component.html',
    standalone: true,
})
export class CantidadComponent {
    @Input() cantidad: number = 1;
    @Input() loading: boolean = false;
    @Output() cantidadChange = new EventEmitter<number>();

    aumentar() {
        if (!this.loading) {
            this.cantidadChange.emit(this.cantidad + 1);
        }
    }

    disminuir() {
        if (this.cantidad > 1 && !this.loading) {
            this.cantidadChange.emit(this.cantidad - 1);
        }
    }
}
