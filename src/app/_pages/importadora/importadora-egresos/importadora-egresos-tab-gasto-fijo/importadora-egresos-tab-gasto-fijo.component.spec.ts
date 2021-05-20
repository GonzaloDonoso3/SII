import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraEgresosTabGastoFijoComponent } from './importadora-egresos-tab-gasto-fijo.component';

describe('ImportadoraEgresosTabGastoFijoComponent', () => {
  let component: ImportadoraEgresosTabGastoFijoComponent;
  let fixture: ComponentFixture<ImportadoraEgresosTabGastoFijoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraEgresosTabGastoFijoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraEgresosTabGastoFijoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
