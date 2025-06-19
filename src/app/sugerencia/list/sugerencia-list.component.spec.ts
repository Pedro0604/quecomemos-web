import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SugerenciaListComponent } from './sugerencia-list.component';

describe('SugerenciaListComponent', () => {
  let component: SugerenciaListComponent;
  let fixture: ComponentFixture<SugerenciaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SugerenciaListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SugerenciaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
