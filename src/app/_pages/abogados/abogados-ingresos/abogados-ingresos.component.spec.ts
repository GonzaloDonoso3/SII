import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosIngresosComponent } from './abogados-ingresos.component';

describe('AbogadosIngresosComponent', () => {
  let component: AbogadosIngresosComponent;
  let fixture: ComponentFixture<AbogadosIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
