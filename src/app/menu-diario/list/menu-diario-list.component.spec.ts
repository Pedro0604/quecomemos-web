import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MenuDiarioListComponent} from './menu-diario-list.component';

describe('MenuDiarioListComponent', () => {
  let component: MenuDiarioListComponent;
  let fixture: ComponentFixture<MenuDiarioListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDiarioListComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(MenuDiarioListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
