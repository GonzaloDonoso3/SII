import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarIngresosComponent } from './rentacar-ingresos.component';

describe('RentacarIngresosComponent', () => {
  let component: RentacarIngresosComponent;
  let fixture: ComponentFixture<RentacarIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
