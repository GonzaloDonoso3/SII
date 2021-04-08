import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarIngresosList2Component } from './rentacar-ingresos-list2.component';

describe('RentacarIngresosList2Component', () => {
  let component: RentacarIngresosList2Component;
  let fixture: ComponentFixture<RentacarIngresosList2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarIngresosList2Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarIngresosList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
