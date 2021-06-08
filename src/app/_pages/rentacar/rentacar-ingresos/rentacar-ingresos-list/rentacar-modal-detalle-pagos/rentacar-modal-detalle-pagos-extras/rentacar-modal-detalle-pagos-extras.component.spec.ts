import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarModalDetallePagosExtrasComponent } from './rentacar-modal-detalle-pagos-extras.component';

describe('RentacarModalDetallePagosExtrasComponent', () => {
  let component: RentacarModalDetallePagosExtrasComponent;
  let fixture: ComponentFixture<RentacarModalDetallePagosExtrasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarModalDetallePagosExtrasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarModalDetallePagosExtrasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
