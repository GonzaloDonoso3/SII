import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosEgresosCuotasComponent } from './abogados-egresos-cuotas.component';

describe('AbogadosEgresosCuotasComponent', () => {
  let component: AbogadosEgresosCuotasComponent;
  let fixture: ComponentFixture<AbogadosEgresosCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosEgresosCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosEgresosCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
