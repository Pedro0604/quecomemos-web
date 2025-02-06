import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDiarioComponent } from './menu-diario.component';

describe('MenuDiarioComponent', () => {
  let component: MenuDiarioComponent;
  let fixture: ComponentFixture<MenuDiarioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDiarioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDiarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
