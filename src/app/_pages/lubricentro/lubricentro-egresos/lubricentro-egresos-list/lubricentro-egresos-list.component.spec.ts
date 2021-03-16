import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricentroEgresosListComponent } from './lubricentro-egresos-list.component';

describe('LubricentroEgresosListComponent', () => {
  let component: LubricentroEgresosListComponent;
  let fixture: ComponentFixture<LubricentroEgresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LubricentroEgresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LubricentroEgresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
