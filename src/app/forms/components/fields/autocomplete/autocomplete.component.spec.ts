import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AutocompleteComponent} from './autocomplete.component';

describe('AutocompleteComponent', () => {
  // @ts-ignore
  let component: AutocompleteComponent;
  // @ts-ignore
  let fixture: ComponentFixture<AutocompleteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AutocompleteComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
