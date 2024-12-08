import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {MatButton} from '@angular/material/button';
import {Menu} from './menu.model';

@Component({
  selector: 'app-menu',
  imports: [MatCardModule, MatIcon, MatDivider, MatButton],
  templateUrl: './menu.component.html',
  standalone: true,
  styleUrl: './menu.component.css'
})

export class MenuComponent {
  @Input({required: true}) menu!: Menu;
  @Input() showButtons: boolean = true;

  constructor() {
  }
}
