import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostalIngresosListComponent } from './hostal-ingresos-list.component';

describe('HostalIngresosListComponent', () => {
  let component: HostalIngresosListComponent;
  let fixture: ComponentFixture<HostalIngresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostalIngresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostalIngresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
