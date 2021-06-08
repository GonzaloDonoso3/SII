import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarHomeComponent } from './rentacar-home.component';

describe('RentacarHomeComponent', () => {
  let component: RentacarHomeComponent;
  let fixture: ComponentFixture<RentacarHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
