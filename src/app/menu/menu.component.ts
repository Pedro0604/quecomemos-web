import {Component, Input} from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatDivider} from '@angular/material/divider';
import {MatAnchor, MatButton} from '@angular/material/button';
import {Menu} from './menu.model';
import {RouterLink} from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [MatCardModule, MatIcon, MatDivider, MatButton, MatAnchor, RouterLink],
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
