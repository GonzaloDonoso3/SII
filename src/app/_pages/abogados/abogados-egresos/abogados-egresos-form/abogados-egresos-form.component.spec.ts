import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosEgresosFormComponent } from './abogados-egresos-form.component';

describe('AbogadosEgresosFormComponent', () => {
  let component: AbogadosEgresosFormComponent;
  let fixture: ComponentFixture<AbogadosEgresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosEgresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosEgresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
