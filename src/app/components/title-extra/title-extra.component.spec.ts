import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TitleExtraComponent } from './title-extra.component';

describe('TitleExtraComponent', () => {
  let component: TitleExtraComponent;
  let fixture: ComponentFixture<TitleExtraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TitleExtraComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TitleExtraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
