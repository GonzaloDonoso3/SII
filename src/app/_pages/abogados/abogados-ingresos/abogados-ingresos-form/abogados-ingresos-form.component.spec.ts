import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosIngresosFormComponent } from './abogados-ingresos-form.component';

describe('AbogadosIngresosFormComponent', () => {
  let component: AbogadosIngresosFormComponent;
  let fixture: ComponentFixture<AbogadosIngresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosIngresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosIngresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
