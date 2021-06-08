import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricentroIngresosFormComponent } from './lubricentro-ingresos-form.component';

describe('LubricentroIngresosFormComponent', () => {
  let component: LubricentroIngresosFormComponent;
  let fixture: ComponentFixture<LubricentroIngresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LubricentroIngresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LubricentroIngresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
