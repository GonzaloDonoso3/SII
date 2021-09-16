import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostalEgresosCuotaDialogComponent } from './hostal-egresos-cuota-dialog.component';

describe('HostalEgresosCuotaDialogComponent', () => {
  let component: HostalEgresosCuotaDialogComponent;
  let fixture: ComponentFixture<HostalEgresosCuotaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostalEgresosCuotaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostalEgresosCuotaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
