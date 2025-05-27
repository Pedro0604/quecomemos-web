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
  @Input() data: number[] = [];
  @Input() color!: string | string[];

  datosGrafico: ChartConfiguration['data'] = { labels: [], datasets: [] };

  opcionesGrafico: ChartConfiguration['options'] = {
    responsive: true,
    scales: { y: { beginAtZero: true } },
    plugins: { legend: { display: false } }
  };

  ngOnChanges() {
    // Determinar backgroundColor y borderColor según tipo de color
    let backgroundColors: string[];
    let borderColors: string[];

    if (Array.isArray(this.color)) {
      backgroundColors = this.color;
      borderColors = this.color.map(c => {
        // convertir opacidad a 1 si contiene valor alpha
        const parts = c.replace(/\s/g, '').match(/rgba?\((\d+),(\d+),(\d+)(?:,(\d*\.?\d+))?\)/);
        if (parts && parts.length === 5) {
          const r = parts[1], g = parts[2], b = parts[3];
          return `rgba(${r}, ${g}, ${b}, 1)`;
        }
        return c;
      });
    } else {
      backgroundColors = [this.color];
      // único border color
      const single = this.color;
      const border = single.replace(/0?\.\d+\)$/, '1)');
      borderColors = [border];
    }

    this.datosGrafico = {
      labels: this.labels,
      datasets: [{
        label: this.titulo,
        data: this.data,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1
      }]
    };
  }
}
