import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosHomeComponent } from './abogados-home.component';

describe('AbogadosHomeComponent', () => {
  let component: AbogadosHomeComponent;
  let fixture: ComponentFixture<AbogadosHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
