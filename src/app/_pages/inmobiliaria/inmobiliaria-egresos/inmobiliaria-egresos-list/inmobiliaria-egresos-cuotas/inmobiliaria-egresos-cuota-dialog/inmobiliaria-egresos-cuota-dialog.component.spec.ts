import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmobiliariaEgresosCuotaDialogComponent } from './inmobiliaria-egresos-cuota-dialog.component';

describe('InmobiliariaEgresosCuotaDialogComponent', () => {
  let component: InmobiliariaEgresosCuotaDialogComponent;
  let fixture: ComponentFixture<InmobiliariaEgresosCuotaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InmobiliariaEgresosCuotaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InmobiliariaEgresosCuotaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
