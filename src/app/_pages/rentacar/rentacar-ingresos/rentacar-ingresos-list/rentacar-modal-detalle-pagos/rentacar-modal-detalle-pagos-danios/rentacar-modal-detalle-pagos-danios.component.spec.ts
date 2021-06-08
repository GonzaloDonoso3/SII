import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarModalDetallePagosDaniosComponent } from './rentacar-modal-detalle-pagos-danios.component';

describe('RentacarModalDetallePagosDaniosComponent', () => {
  let component: RentacarModalDetallePagosDaniosComponent;
  let fixture: ComponentFixture<RentacarModalDetallePagosDaniosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarModalDetallePagosDaniosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarModalDetallePagosDaniosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
