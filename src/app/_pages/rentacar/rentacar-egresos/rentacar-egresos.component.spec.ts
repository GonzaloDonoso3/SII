import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarEgresosComponent } from './rentacar-egresos.component';

describe('RentacarEgresosComponent', () => {
  let component: RentacarEgresosComponent;
  let fixture: ComponentFixture<RentacarEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
