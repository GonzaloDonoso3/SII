import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricentroEgresosFormComponent } from './lubricentro-egresos-form.component';

describe('LubricentroEgresosFormComponent', () => {
  let component: LubricentroEgresosFormComponent;
  let fixture: ComponentFixture<LubricentroEgresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LubricentroEgresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LubricentroEgresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
