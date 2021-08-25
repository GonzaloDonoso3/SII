import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmobiliariaEgresosCuotasComponent } from './inmobiliaria-egresos-cuotas.component';

describe('InmobiliariaEgresosCuotasComponent', () => {
  let component: InmobiliariaEgresosCuotasComponent;
  let fixture: ComponentFixture<InmobiliariaEgresosCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InmobiliariaEgresosCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InmobiliariaEgresosCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
