import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraIngresosFormComponent } from './importadora-ingresos-form.component';

describe('ImportadoraIngresosFormComponent', () => {
  let component: ImportadoraIngresosFormComponent;
  let fixture: ComponentFixture<ImportadoraIngresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraIngresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraIngresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
