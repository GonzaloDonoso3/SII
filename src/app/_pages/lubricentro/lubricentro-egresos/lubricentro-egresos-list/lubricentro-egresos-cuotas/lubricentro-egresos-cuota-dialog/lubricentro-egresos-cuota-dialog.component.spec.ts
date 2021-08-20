import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricentroEgresosCuotaDialogComponent } from './lubricentro-egresos-cuota-dialog.component';

describe('LubricentroEgresosCuotaDialogComponent', () => {
  let component: LubricentroEgresosCuotaDialogComponent;
  let fixture: ComponentFixture<LubricentroEgresosCuotaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LubricentroEgresosCuotaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LubricentroEgresosCuotaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
