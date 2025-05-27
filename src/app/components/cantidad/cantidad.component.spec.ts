import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CantidadComponent } from './cantidad.component';

describe('CantidadComponent', () => {
  let component: CantidadComponent;
  let fixture: ComponentFixture<CantidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CantidadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CantidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
