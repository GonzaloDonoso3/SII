import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosIngresosAccionesComponent } from './abogados-ingresos-acciones.component';

describe('AbogadosIngresosAccionesComponent', () => {
  let component: AbogadosIngresosAccionesComponent;
  let fixture: ComponentFixture<AbogadosIngresosAccionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosIngresosAccionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosIngresosAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
