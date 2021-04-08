import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarModalDetallePagosComponent } from './rentacar-modal-detalle-pagos.component';

describe('RentacarModalDetallePagosComponent', () => {
  let component: RentacarModalDetallePagosComponent;
  let fixture: ComponentFixture<RentacarModalDetallePagosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarModalDetallePagosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarModalDetallePagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
