import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraEgresosTabGastoNeumaticosFormComponent } from './importadora-egresos-tab-gasto-neumaticos-form.component';

describe('ImportadoraEgresosTabGastoNeumaticosFormComponent', () => {
  let component: ImportadoraEgresosTabGastoNeumaticosFormComponent;
  let fixture: ComponentFixture<ImportadoraEgresosTabGastoNeumaticosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraEgresosTabGastoNeumaticosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraEgresosTabGastoNeumaticosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
