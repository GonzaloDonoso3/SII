import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraIngresosComponent } from './importadora-ingresos.component';

describe('ImportadoraIngresosComponent', () => {
  let component: ImportadoraIngresosComponent;
  let fixture: ComponentFixture<ImportadoraIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
