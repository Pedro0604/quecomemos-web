import {Component, OnInit} from '@angular/core';
import {RouterLink} from "@angular/router";
import {MatAnchor} from "@angular/material/button";
import {Comida} from "../comida/comida.model";
import {ComidaService} from "../comida/service/comida.service";
import {ComidaComponent} from "../comida/component/comida.component";
import {FaIconComponent} from "@fortawesome/angular-fontawesome";
import {faFacebook, faInstagram, faLinkedin, faXTwitter, faYoutube} from "@fortawesome/free-brands-svg-icons";
import {PermissionAware} from '../permiso/permissionAware';
import {getMenuActual, MenuDiario, traduccionDiasSemana} from '../menu-diario/menu-diario.model';
import {MenuDiarioService} from '../menu-diario/service/menu-diario.service';
import {MenuDiarioComponent} from '../menu-diario/component/menu-diario.component';

@Component({
  selector: 'app-home',
  imports: [
    RouterLink,
    MatAnchor,
    ComidaComponent,
    FaIconComponent,
    MenuDiarioComponent
  ],
  templateUrl: './home.component.html',
  standalone: true
})
export class HomeComponent implements OnInit {
  protected comidas: Comida[] = [];
  protected menuDiario: PermissionAware<MenuDiario> | null = null;

  constructor(private comidaService: ComidaService, private menuDiarioService: MenuDiarioService) {
  }

  ngOnInit() {
    this.comidaService.getDestacadas().subscribe({
      next: (data) => {
        this.comidas = data.slice(0, 3) ?? [];
      },
      error: (error) => {
        console.error('Error al obtener las comidas', error);
      }
    });
    this.menuDiarioService.getMenusDiariosSemanal().subscribe({
      next: (data) => {
        this.menuDiario = data.find(pawm => pawm.data.dia === getMenuActual()) ?? null;
      },
      error: (error) => {
        console.error('Error al obtener las comidas', error);
      }
    });
  }

  protected readonly faFacebook = faFacebook;
  protected readonly faInstagram = faInstagram;
  protected readonly faXTwitter = faXTwitter;
  protected readonly faLinkedin = faLinkedin;
  protected readonly faYoutube = faYoutube;
  protected readonly traduccionDiasSemana = traduccionDiasSemana;
}
