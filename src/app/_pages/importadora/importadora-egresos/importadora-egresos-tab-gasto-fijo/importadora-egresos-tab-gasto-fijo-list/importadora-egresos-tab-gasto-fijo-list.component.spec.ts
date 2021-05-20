import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraEgresosTabGastoFijoListComponent } from './importadora-egresos-tab-gasto-fijo-list.component';

describe('ImportadoraEgresosTabGastoFijoListComponent', () => {
  let component: ImportadoraEgresosTabGastoFijoListComponent;
  let fixture: ComponentFixture<ImportadoraEgresosTabGastoFijoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraEgresosTabGastoFijoListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraEgresosTabGastoFijoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
