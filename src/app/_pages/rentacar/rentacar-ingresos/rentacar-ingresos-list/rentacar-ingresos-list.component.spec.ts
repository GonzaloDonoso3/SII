import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarIngresosListComponent } from './rentacar-ingresos-list.component';

describe('RentacarIngresosListComponent', () => {
  let component: RentacarIngresosListComponent;
  let fixture: ComponentFixture<RentacarIngresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarIngresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarIngresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
