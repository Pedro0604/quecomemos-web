import {Component, OnInit} from '@angular/core';
import {EstadisticaService} from './grafico-estadistico/estadistica.service';
import {GraficoEstadisticoComponent} from './grafico-estadistico/grafico-estadistico.component';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [GraficoEstadisticoComponent, CommonModule],
  templateUrl: './estadisticas.component.html'
})
export class EstadisticasComponent implements OnInit {
  graficos: {
    titulo: string;
    tipo: 'bar' | 'line' | 'pie' | 'doughnut';
    labels: string[];
    data: number[];
    color: string;
  }[] = [];

  constructor(private estadisticasService: EstadisticaService) {
  }

  ngOnInit() {
    this.estadisticasService.getEstadisticas().subscribe(resp => {
      this.graficos = [
        {
          titulo: 'Ventas por día',
          tipo: 'line',
          labels: resp['ventas-dia']?.labels || [],
          data: resp['ventas-dia']?.data || [],
          color: 'rgba(54, 162, 235, 0.5)'
        },
        {
          titulo: 'Ingresos por metodo de pago',
          tipo: 'bar',
          labels: resp['ingresos-metodo-pago']?.labels || [],
          data: resp['ingresos-metodo-pago']?.data || [],
          color: 'rgba(54, 162, 235, 0.5)'
        },
        {
          titulo: 'Menues por dia',
          tipo: 'bar',
          labels: resp['menus-dia']?.labels || [],
          data: resp['menus-dia']?.data || [],
          color: 'rgba(54, 162, 235, 0.5)'
        }
      ];
    });
  }

}
