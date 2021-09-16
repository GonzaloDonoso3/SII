import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaEgresosCuotaDialogComponent } from './agro-firma-egresos-cuota-dialog.component';

describe('AgroFirmaEgresosCuotaDialogComponent', () => {
  let component: AgroFirmaEgresosCuotaDialogComponent;
  let fixture: ComponentFixture<AgroFirmaEgresosCuotaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaEgresosCuotaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaEgresosCuotaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
