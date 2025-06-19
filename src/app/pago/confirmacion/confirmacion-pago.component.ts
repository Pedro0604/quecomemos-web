import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {MatButtonModule} from '@angular/material/button';
import {Entidad, getEntidadLink} from '../../permiso/entidad';

@Component({
  selector: 'app-confirmacion-pago',
  templateUrl: './confirmacion-pago.component.html',
  standalone: true,
  imports: [MatButtonModule, RouterLink],
})
export class ConfirmacionPagoComponent implements OnInit {
  protected pedidoId: string | number = "";

  protected readonly getEntidadLink = getEntidadLink;
  protected readonly Entidad = Entidad;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.pedidoId = this.route.snapshot.params['pedidoId'];
    if (!this.pedidoId) {
      this.router.navigate(['/']);
    }
  }
}

