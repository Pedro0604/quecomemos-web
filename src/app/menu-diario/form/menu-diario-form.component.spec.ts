import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuDiarioFormComponent} from './menu-diario-form.component';

describe('MenuDiarioFormComponent', () => {
  let component: MenuDiarioFormComponent;
  let fixture: ComponentFixture<MenuDiarioFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDiarioFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MenuDiarioFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
