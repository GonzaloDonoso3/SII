import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarEgresosCuotaDialogComponent } from './rentacar-egresos-cuota-dialog.component';

describe('RentacarEgresosCuotaDialogComponent', () => {
  let component: RentacarEgresosCuotaDialogComponent;
  let fixture: ComponentFixture<RentacarEgresosCuotaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarEgresosCuotaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarEgresosCuotaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
