import {Component, OnInit, viewChild} from '@angular/core';
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MenuDiarioComponent} from "../menu-diario/component/menu-diario.component";
import {RouterLink} from "@angular/router";
import {MenuDiario, traduccionDiasSemana} from '../menu-diario/menu-diario.model';
import {MenuDiarioService} from '../menu-diario/service/menu-diario.service';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';
import {TitleComponent} from "../components/title/title.component";
import {AuthService} from '../auth/service/auth.service';
import {Entidad} from '../permiso/entidad';
import {Accion} from '../permiso/accion';

@Component({
  selector: 'app-home',
  imports: [
    MatAnchor,
    MatIcon,
    MatProgressSpinner,
    MenuDiarioComponent,
    RouterLink,
    MatButton,
    MatExpansionModule,
    TitleComponent
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  accordion = viewChild.required(MatAccordion);
  menusDiarios: MenuDiario[] = [];

  error = false;
  loading = true;
  protected readonly traduccionDiasSemana = traduccionDiasSemana;

  constructor(private menuDiarioService: MenuDiarioService, protected authService: AuthService) {
  }

  ngOnInit(): void {
    this.menuDiarioService.getMenusDiariosSemanal().subscribe({
      next: (data) => {
        this.menusDiarios = data ?? [];
      },
      error: (error) => {
        console.error('Error al obtener el menu semanal', error);
        this.error = true;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  protected readonly Accion = Accion;
  protected readonly Entidad = Entidad;
}
