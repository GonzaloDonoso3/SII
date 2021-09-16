import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraEgresosTabCuotasComponent } from './importadora-egresos-tab-cuotas.component';

describe('ImportadoraEgresosTabCuotasComponent', () => {
  let component: ImportadoraEgresosTabCuotasComponent;
  let fixture: ComponentFixture<ImportadoraEgresosTabCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraEgresosTabCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraEgresosTabCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
