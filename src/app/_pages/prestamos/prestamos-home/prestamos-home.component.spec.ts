import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrestamosHomeComponent } from './prestamos-home.component';

describe('PrestamosHomeComponent', () => {
  let component: PrestamosHomeComponent;
  let fixture: ComponentFixture<PrestamosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrestamosHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrestamosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
