import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosEgresosCuotaDialogComponent } from './abogados-egresos-cuota-dialog.component';

describe('AbogadosEgresosCuotaDialogComponent', () => {
  let component: AbogadosEgresosCuotaDialogComponent;
  let fixture: ComponentFixture<AbogadosEgresosCuotaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosEgresosCuotaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosEgresosCuotaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
