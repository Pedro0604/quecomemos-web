import {Component, TemplateRef, viewChild, ViewChild} from '@angular/core';
import {MatAnchor, MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MenuDiarioComponent} from "../menu-diario/component/menu-diario.component";
import {RouterLink} from "@angular/router";
import {MenuDiario, traduccionDiasSemana} from '../menu-diario/menu-diario.model';
import {LayoutService} from '../layout/layout.service';
import {MenuDiarioService} from '../menu-diario/service/menu-diario.service';
import {MatAccordion, MatExpansionModule} from '@angular/material/expansion';

@Component({
  selector: 'app-home',
  imports: [
    MatAnchor,
    MatIcon,
    MatProgressSpinner,
    MenuDiarioComponent,
    RouterLink,
    MatButton,
    MatExpansionModule
  ],
  templateUrl: './home.component.html',
  standalone: true,
  styleUrl: './home.component.css'
})
export class HomeComponent {
  accordion = viewChild.required(MatAccordion);
  menusDiarios: MenuDiario[] = [];

  error = false;
  loading = true;

  constructor(private layoutService: LayoutService, private menuDiarioService: MenuDiarioService) {
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

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Menú semanal');
    this.layoutService.setExtra(this.extraTemplate);
  }

  protected readonly traduccionDiasSemana = traduccionDiasSemana;
}
