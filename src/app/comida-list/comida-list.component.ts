import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Comida} from '../comida/comida.model';
import {LayoutService} from '../layout/layout.service';
import {ComidaService} from '../comida/comida.service';
import {MatIcon} from '@angular/material/icon';
import {MatProgressSpinner} from '@angular/material/progress-spinner';
import {ComidaComponent} from '../comida/comida.component';

@Component({
  selector: 'app-comida-list',
  imports: [
    MatIcon,
    MatProgressSpinner,
    ComidaComponent
  ],
  templateUrl: './comida-list.component.html',
  standalone: true,
  styleUrl: './comida-list.component.css'
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

  @ViewChild('extra') extraTemplate!: TemplateRef<any> | null;

  ngAfterViewInit(): void {
    this.layoutService.setTitle('Todas las comidas');
    this.layoutService.setExtra(this.extraTemplate);
  }

  handleDeleteComida(id: number) {
    this.comidas = this.comidas.filter(comida => comida.id !== id);
  }
}
