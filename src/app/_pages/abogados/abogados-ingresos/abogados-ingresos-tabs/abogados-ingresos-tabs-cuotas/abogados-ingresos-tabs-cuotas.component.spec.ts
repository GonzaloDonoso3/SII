import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosIngresosTabsCuotasComponent } from './abogados-ingresos-tabs-cuotas.component';

describe('AbogadosIngresosTabsCuotasComponent', () => {
  let component: AbogadosIngresosTabsCuotasComponent;
  let fixture: ComponentFixture<AbogadosIngresosTabsCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosIngresosTabsCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosIngresosTabsCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
