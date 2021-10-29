import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaEmpresasComponent } from './factura-empresas.component';

describe('FacturaEmpresasComponent', () => {
  let component: FacturaEmpresasComponent;
  let fixture: ComponentFixture<FacturaEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaEmpresasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
