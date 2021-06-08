import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarIngresosFormComponent } from './rentacar-ingresos-form.component';

describe('RentacarIngresosFormComponent', () => {
  let component: RentacarIngresosFormComponent;
  let fixture: ComponentFixture<RentacarIngresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarIngresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarIngresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
