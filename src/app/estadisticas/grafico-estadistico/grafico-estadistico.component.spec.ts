import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GraficoEstadisticoComponent } from './grafico-estadistico.component';
import { BaseChartDirective } from 'ng2-charts';
import Chart from 'chart.js/auto';

describe('GraficoEstadisticoComponent', () => {
  let component: GraficoEstadisticoComponent;
  let fixture: ComponentFixture<GraficoEstadisticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GraficoEstadisticoComponent, BaseChartDirective]
    }).compileComponents();

    fixture = TestBed.createComponent(GraficoEstadisticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

});
