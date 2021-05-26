import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraEgresosTabGastoNeumaticosComponent } from './importadora-egresos-tab-gasto-neumaticos.component';

describe('ImportadoraEgresosTabGastoNeumaticosComponent', () => {
  let component: ImportadoraEgresosTabGastoNeumaticosComponent;
  let fixture: ComponentFixture<ImportadoraEgresosTabGastoNeumaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraEgresosTabGastoNeumaticosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraEgresosTabGastoNeumaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
