import { Component, Input, OnChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, Chart, registerables } from 'chart.js';
import { CommonModule } from '@angular/common';

Chart.register(...registerables);

@Component({
  selector: 'app-grafico-estadistico',
  standalone: true,
  imports: [BaseChartDirective, CommonModule],
  templateUrl: 'grafico-estadistico.component.html'
})
export class GraficoEstadisticoComponent implements OnChanges {
  @Input() titulo = '';
  @Input() tipo: ChartType = 'bar';
  @Input() labels: string[] = [];
  @Input() datos: number[] = [];
  @Input() color = 'rgba(54, 162, 235, 0.5)';

  datosGrafico: ChartConfiguration['data'] = { labels: [], datasets: [] };

  opcionesGrafico: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: false } }
  };

  ngOnChanges() {
    this.datosGrafico = {
      labels: this.labels,
      datasets: [{
        label: this.titulo,
        data: this.datos,
        backgroundColor: this.color,
        borderColor: this.color.replace('0.5', '1'),
        borderWidth: 1
      }]
    };
  }
}
