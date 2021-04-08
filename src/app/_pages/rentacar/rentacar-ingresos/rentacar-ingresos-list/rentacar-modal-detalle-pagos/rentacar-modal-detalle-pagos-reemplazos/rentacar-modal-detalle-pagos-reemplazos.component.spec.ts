import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarModalDetallePagosReemplazosComponent } from './rentacar-modal-detalle-pagos-reemplazos.component';

describe('RentacarModalDetallePagosReemplazosComponent', () => {
  let component: RentacarModalDetallePagosReemplazosComponent;
  let fixture: ComponentFixture<RentacarModalDetallePagosReemplazosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarModalDetallePagosReemplazosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarModalDetallePagosReemplazosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
