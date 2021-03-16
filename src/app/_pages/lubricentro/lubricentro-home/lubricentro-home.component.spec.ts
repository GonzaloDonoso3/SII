import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricentroHomeComponent } from './lubricentro-home.component';

describe('LubricentroHomeComponent', () => {
  let component: LubricentroHomeComponent;
  let fixture: ComponentFixture<LubricentroHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LubricentroHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LubricentroHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
