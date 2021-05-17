import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraEgresosTabGastoFijoFormComponent } from './importadora-egresos-tab-gasto-fijo-form.component';

describe('ImportadoraEgresosTabGastoFijoFormComponent', () => {
  let component: ImportadoraEgresosTabGastoFijoFormComponent;
  let fixture: ComponentFixture<ImportadoraEgresosTabGastoFijoFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraEgresosTabGastoFijoFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraEgresosTabGastoFijoFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
