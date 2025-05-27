import { Component, OnInit } from '@angular/core';
import { EstadisticaService } from './grafico-estadistico/estadistica.service';
import { GraficoEstadisticoComponent } from './grafico-estadistico/grafico-estadistico.component';
import { CommonModule } from '@angular/common';

type TipoGrafico = 'bar' | 'line' | 'pie' | 'doughnut';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [GraficoEstadisticoComponent, CommonModule],
  templateUrl: './estadisticas.component.html'
})



export class EstadisticasComponent implements OnInit {

  reportesDisponibles: { id: string; titulo: string; tipo: TipoGrafico }[] = [
    { id: 'ventas-dia', titulo: 'Ventas por día', tipo: 'line' },
    { id: 'ingresos-metodo-pago', titulo: 'Ingresos por método de pago', tipo: 'bar' },
    { id: 'menus-dia', titulo: 'Menús por día', tipo: 'bar' },
    { id: "clientes-frecuentes", titulo: "Clientes frecuentes", tipo: "bar" },
    { id: 'productos-populares', titulo: 'Productos populares', tipo: 'pie' },
    { id: 'ventas-hora', titulo: 'Ventas por hora', tipo: 'line' },
    { id: 'ingresos-mensuales', titulo: 'Ingresos mensuales', tipo: 'bar' }
  ];

  graficos: {
    id: string;
    titulo: string;
    tipo: TipoGrafico;
    labels: string[];
    data: number[];
    color: string[];
  }[] = [];

  cargando: Set<string> = new Set();

  constructor(private estadisticasService: EstadisticaService) {}

  ngOnInit(): void {
  }

  getGrafico(id: string) {
    return this.graficos.find(g => g.id === id);
  }

  desplegados = new Set<string>();

  toggleDesplegado(id: string) {
    if (this.desplegados.has(id)) {
      this.desplegados.delete(id);
    } else {
      this.desplegados.add(id);
    }
  }

  estaDesplegado(id: string): boolean {
    return this.desplegados.has(id);
  }

  generarGrafico(reporte: { id: string; titulo: string; tipo: TipoGrafico }) {
    if (this.cargando.has(reporte.id)) return;

    this.cargando.add(reporte.id);

    this.estadisticasService.getEstadisticaPorId(reporte.id).subscribe(resp => {

      function generarColoresAleatorios(cantidad: number): string[] {
        const colores: string[] = [];

        for (let i = 0; i < cantidad; i++) {
          const r = Math.floor(Math.random() * 156) + 100; // colores más suaves
          const g = Math.floor(Math.random() * 156) + 100;
          const b = Math.floor(Math.random() * 156) + 100;
          colores.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
        }

        return colores;
      }

      const nuevoGrafico = {
        id: reporte.id,
        titulo: reporte.titulo,
        tipo: reporte.tipo,
        labels: resp.labels || [],
        data: resp.data || [],
        color: generarColoresAleatorios(resp.labels.length)
      };

      const index = this.graficos.findIndex(g => g.id === reporte.id);
      if (index !== -1) {
        this.graficos[index] = nuevoGrafico;
      } else {
        this.graficos.push(nuevoGrafico);
      }

      this.cargando.delete(reporte.id);
    });
  }

}
