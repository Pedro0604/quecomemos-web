import { TestBed } from '@angular/core/testing';

import { MenuDiarioService } from './menu-diario.service';

describe('MenuDiarioService', () => {
  let service: MenuDiarioService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MenuDiarioService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
