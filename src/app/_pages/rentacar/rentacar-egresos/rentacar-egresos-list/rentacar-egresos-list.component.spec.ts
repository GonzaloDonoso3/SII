import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarEgresosListComponent } from './rentacar-egresos-list.component';

describe('RentacarEgresosListComponent', () => {
  let component: RentacarEgresosListComponent;
  let fixture: ComponentFixture<RentacarEgresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarEgresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarEgresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
