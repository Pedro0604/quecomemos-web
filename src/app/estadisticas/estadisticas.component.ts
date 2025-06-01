import { Component, OnInit } from '@angular/core';
import { EstadisticaService } from './grafico-estadistico/estadistica.service';
import { GraficoEstadisticoComponent } from './grafico-estadistico/grafico-estadistico.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
type TipoGrafico = 'bar' | 'line' | 'pie' | 'doughnut';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [GraficoEstadisticoComponent, CommonModule, FormsModule],
  templateUrl: './estadisticas.component.html'
})



export class EstadisticasComponent implements OnInit {

  reportesDisponibles: { id: string; titulo: string; tipo: TipoGrafico }[] = [
    { id: 'ventas', titulo: 'Ventas por día', tipo: 'line' },
    { id: 'ingresos-metodo-pago', titulo: 'Ingresos por método de pago', tipo: 'bar' },
    { id: 'menus-dia', titulo: 'Menús por día', tipo: 'bar' },
    { id: "clientes-frecuentes", titulo: "Clientes frecuentes", tipo: "bar" },
    { id: 'productos-populares', titulo: 'Productos populares', tipo: 'pie' },
    { id: 'ventas-hora', titulo: 'Ventas por hora', tipo: 'line' },
    { id: 'ingresos-mensuales', titulo: 'Ingresos mensuales', tipo: 'bar' }
  ];

  filtros: Record<string, { desde: string; hasta: string }> = {};


  graficos: {
    id: string;
    titulo: string;
    tipo: TipoGrafico;
    labels: string[];
    data: number[];
    color: string | string[];
  }[] = [];

  cargando: Set<string> = new Set();

  error: Record<string, string> = {};

  periodoResumen: 'diario' | 'semanal' | 'mensual' = 'diario';

  resumen: {
    menusVendidos: number;
    comidasVendidas: number;
    dineroRecaudado: number;
  } | null = null;


  constructor(private estadisticasService: EstadisticaService) {}

  ngOnInit(): void {
    this.reportesDisponibles.forEach(r => {
      this.filtros[r.id] = { desde: '', hasta: '' };
    });

    this.cargarResumen();

  }

  onPeriodoResumenChange(periodo: 'diario' | 'semanal' | 'mensual') {
    this.periodoResumen = periodo;
    this.cargarResumen();
  }

  getGrafico(id: string) {
    return this.graficos.find(g => g.id === id);
  }

  cargarResumen() {
    this.estadisticasService.getResumenEstadisticas(this.periodoResumen).subscribe({
      next: (res) => this.resumen = res,
      error: () => this.resumen = null
    });
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

  generarGraficoConFiltro(reporte: { id: string; titulo: string; tipo: TipoGrafico }) {

    this.error[reporte.id] = '';
    if (this.cargando.has(reporte.id)) return;
    this.cargando.add(reporte.id);

    const { desde, hasta } = this.filtros[reporte.id];

    if ((desde && isNaN(Date.parse(desde))) || (hasta && isNaN(Date.parse(hasta)))) {
      this.error[reporte.id] = 'Las fechas ingresadas no son válidas.';
      this.cargando.delete(reporte.id);
      return;
    }

    if (desde && hasta && new Date(desde) > new Date(hasta)) {
      this.error[reporte.id] = 'La fecha "desde" no puede ser posterior a la fecha "hasta".';
      this.cargando.delete(reporte.id);
      return;
    }
    const fechaDesde = desde || undefined;
    const fechaHasta = hasta || undefined;

    this.estadisticasService
      .getEstadisticaPorIdConFiltro(reporte.id, fechaDesde, fechaHasta)
      .subscribe(resp => {
        // Generar colores si es pie
        const color =
          reporte.tipo === 'pie'
            ? this.generarColoresAleatorios(resp.labels.length)
            : `rgba(54,162,235,0.6)`;

        const nuevo = {
          id: reporte.id,
          titulo: reporte.titulo,
          tipo: reporte.tipo,
          labels: resp.labels,
          data: resp.data,
          color
        };
        const i = this.graficos.findIndex(g => g.id === reporte.id);
        i >= 0 ? (this.graficos[i] = nuevo) : this.graficos.push(nuevo);
        this.cargando.delete(reporte.id);
      }, () => this.cargando.delete(reporte.id));
  }

  private generarColoresAleatorios(cantidad: number): string[] {
    return Array.from({ length: cantidad }, () => {
      const r = Math.floor(Math.random() * 156) + 100;
      const g = Math.floor(Math.random() * 156) + 100;
      const b = Math.floor(Math.random() * 156) + 100;
      return `rgba(${r}, ${g}, ${b}, 0.6)`;
    });
  }

}
