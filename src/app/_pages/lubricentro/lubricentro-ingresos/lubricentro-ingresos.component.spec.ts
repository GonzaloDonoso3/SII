import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricentroIngresosComponent } from './lubricentro-ingresos.component';

describe('LubricentroIngresosComponent', () => {
  let component: LubricentroIngresosComponent;
  let fixture: ComponentFixture<LubricentroIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LubricentroIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LubricentroIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
