import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraEgresosTabCuotaDialogComponent } from './importadora-egresos-tab-cuota-dialog.component';

describe('ImportadoraEgresosTabCuotaDialogComponent', () => {
  let component: ImportadoraEgresosTabCuotaDialogComponent;
  let fixture: ComponentFixture<ImportadoraEgresosTabCuotaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraEgresosTabCuotaDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraEgresosTabCuotaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
