import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Comida} from '../comida.model';
import {LayoutService} from '../../layout/layout.service';
import {ComidaService} from '../service/comida.service';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ComidaComponent} from '../component/comida.component';
import {MatAnchor} from "@angular/material/button";
import {RouterLink} from "@angular/router";
import {TitleExtraComponent} from '../../components/title-extra/title-extra.component';

@Component({
  selector: 'app-comida-list',
  imports: [
    MatIcon,
    MatProgressSpinner,
    ComidaComponent,
    MatAnchor,
    RouterLink,
    TitleExtraComponent
  ],
  templateUrl: './comida-list.component.html',
  standalone: true,
})
export class ComidaListComponent implements AfterViewInit, OnInit {
  comidas: Comida[] = [];

  error = false;
  loading = true;

  constructor(private layoutService: LayoutService, private comidaService: ComidaService) {
  }

  ngOnInit(): void {
    this.comidaService.getComidas().subscribe({
      next: (data) => {
        this.comidas = data;
      },
      error: (error) => {
        console.error('Error al obtener las comidas', error);
        this.error = true;
      },
      complete: () => {
        this.loading = false;
      }
    });
  }

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Todas las comidas');
  }

  handleDeleteComida(id: number) {
    this.comidas = this.comidas.filter(comida => comida.id !== id);
  }
}
