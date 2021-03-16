import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostalIngresosComponent } from './hostal-ingresos.component';

describe('HostalIngresosComponent', () => {
  let component: HostalIngresosComponent;
  let fixture: ComponentFixture<HostalIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostalIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostalIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
