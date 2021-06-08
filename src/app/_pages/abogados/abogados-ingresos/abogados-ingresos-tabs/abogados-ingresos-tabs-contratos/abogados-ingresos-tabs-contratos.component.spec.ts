import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosIngresosTabsContratosComponent } from './abogados-ingresos-tabs-contratos.component';

describe('AbogadosIngresosTabsContratosComponent', () => {
  let component: AbogadosIngresosTabsContratosComponent;
  let fixture: ComponentFixture<AbogadosIngresosTabsContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosIngresosTabsContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosIngresosTabsContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
