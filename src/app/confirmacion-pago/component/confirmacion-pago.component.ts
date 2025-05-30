import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-confirmacion-pago',
  templateUrl: './confirmacion-pago.component.html',
  standalone: true,
  imports: [MatButtonModule],
})
export class ConfirmacionPagoComponent implements OnInit {

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {  }

  volverInicio() {
    this.router.navigate(['/']);
  }
}

