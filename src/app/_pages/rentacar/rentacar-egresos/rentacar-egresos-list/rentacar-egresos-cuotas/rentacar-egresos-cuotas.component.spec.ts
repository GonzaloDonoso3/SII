import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarEgresosCuotasComponent } from './rentacar-egresos-cuotas.component';

describe('RentacarEgresosCuotasComponent', () => {
  let component: RentacarEgresosCuotasComponent;
  let fixture: ComponentFixture<RentacarEgresosCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarEgresosCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarEgresosCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
