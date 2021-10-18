import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamosIngresosEgresosComponent } from './prestamos-ingresos-egresos.component';

describe('PrestamosIngresosEgresosComponent', () => {
  let component: PrestamosIngresosEgresosComponent;
  let fixture: ComponentFixture<PrestamosIngresosEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestamosIngresosEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestamosIngresosEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
