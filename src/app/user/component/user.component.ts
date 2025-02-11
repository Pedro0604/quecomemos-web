import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {User} from '../user.model';
import {
  MatCard,
  MatCardActions,
  MatCardContent,
  MatCardHeader,
  MatCardSubtitle,
  MatCardTitle
} from '@angular/material/card';
import {MatIcon} from '@angular/material/icon';
import {MatAnchor, MatButton} from '@angular/material/button';
import {RouterLink} from '@angular/router';

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
    MatCardSubtitle,
    MatAnchor,
    MatButton,
    RouterLink
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
