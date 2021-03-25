import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarEgresosFormComponent } from './rentacar-egresos-form.component';

describe('RentacarEgresosFormComponent', () => {
  let component: RentacarEgresosFormComponent;
  let fixture: ComponentFixture<RentacarEgresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarEgresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarEgresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
