import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricentroEgresosComponent } from './lubricentro-egresos.component';

describe('LubricentroEgresosComponent', () => {
  let component: LubricentroEgresosComponent;
  let fixture: ComponentFixture<LubricentroEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LubricentroEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LubricentroEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
