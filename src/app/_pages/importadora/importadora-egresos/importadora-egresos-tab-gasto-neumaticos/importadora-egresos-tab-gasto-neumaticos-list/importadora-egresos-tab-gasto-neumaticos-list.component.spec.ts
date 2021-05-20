import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraEgresosTabGastoNeumaticosListComponent } from './importadora-egresos-tab-gasto-neumaticos-list.component';

describe('ImportadoraEgresosTabGastoNeumaticosListComponent', () => {
  let component: ImportadoraEgresosTabGastoNeumaticosListComponent;
  let fixture: ComponentFixture<ImportadoraEgresosTabGastoNeumaticosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraEgresosTabGastoNeumaticosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraEgresosTabGastoNeumaticosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
