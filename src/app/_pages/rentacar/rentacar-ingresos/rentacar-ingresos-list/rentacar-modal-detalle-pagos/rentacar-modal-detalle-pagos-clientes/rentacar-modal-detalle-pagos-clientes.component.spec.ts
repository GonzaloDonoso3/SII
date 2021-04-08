import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarModalDetallePagosClientesComponent } from './rentacar-modal-detalle-pagos-clientes.component';

describe('RentacarModalDetallePagosClientesComponent', () => {
  let component: RentacarModalDetallePagosClientesComponent;
  let fixture: ComponentFixture<RentacarModalDetallePagosClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarModalDetallePagosClientesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarModalDetallePagosClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
