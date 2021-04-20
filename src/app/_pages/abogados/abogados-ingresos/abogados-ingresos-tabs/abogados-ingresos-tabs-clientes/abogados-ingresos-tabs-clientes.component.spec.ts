import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosIngresosTabsClientesComponent } from './abogados-ingresos-tabs-clientes.component';

describe('AbogadosIngresosTabsClientesComponent', () => {
  let component: AbogadosIngresosTabsClientesComponent;
  let fixture: ComponentFixture<AbogadosIngresosTabsClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosIngresosTabsClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosIngresosTabsClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
