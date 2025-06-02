import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPedidoComponent } from './view-pedido.component';

describe('ViewPedidoComponent', () => {
  let component: ViewPedidoComponent;
  let fixture: ComponentFixture<ViewPedidoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewPedidoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
