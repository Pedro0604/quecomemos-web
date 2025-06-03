import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatAnchor} from "@angular/material/button";
import {Comida} from "../comida/comida.model";
import {ComidaService} from "../comida/service/comida.service";
import {PermissionAware} from "../permiso/permissionAware";
import {ComidaComponent} from "../comida/component/comida.component";

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatAnchor,
    ComidaComponent
  ],
  templateUrl: './home.component.html',
  standalone: true
})
export class HomeComponent implements OnInit {
  protected comidas: PermissionAware<Comida>[] = [];

  constructor(private comidaService: ComidaService) {
  }

  ngOnInit() {
    this.comidaService.getAll().subscribe({
      next: (data) => {
        this.comidas = data.slice(0, 3) ?? [];
      },
      error: (error) => {
        console.error('Error al obtener las comidas', error);
      }
    });
  }
}
