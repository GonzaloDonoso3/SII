import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricentroIngresosListComponent } from './lubricentro-ingresos-list.component';

describe('LubricentroIngresosListComponent', () => {
  let component: LubricentroIngresosListComponent;
  let fixture: ComponentFixture<LubricentroIngresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LubricentroIngresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LubricentroIngresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
