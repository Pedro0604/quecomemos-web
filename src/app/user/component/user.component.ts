import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {User} from '../user.model';
import {MatCard, MatCardActions, MatCardContent, MatCardHeader, MatCardTitle} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatAnchor} from '@angular/material/button';
import {RouterLink} from '@angular/router';
import {DefaultImageDirective} from '../../directives/default-image-directive/default-image.directive';
import {MatTooltip} from '@angular/material/tooltip';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  standalone: true,
  imports: [
    MatCard,
    MatCardHeader,
    MatIcon,
    MatCardContent,
    MatCardActions,
    MatCardTitle,
    MatAnchor,
    RouterLink,
    DefaultImageDirective,
    MatTooltip
  ],
  styleUrl: './user.component.html'
})
export class UserComponent {
  dialog = inject(MatDialog);
  @Input({required: true}) user!: User;
  @Input() showButtons: boolean = true;
  @Output() onDelete = new EventEmitter<number>();

  constructor() {
  }

}
