import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbogadosEgresosComponent } from './abogados-egresos.component';

describe('AbogadosEgresosComponent', () => {
  let component: AbogadosEgresosComponent;
  let fixture: ComponentFixture<AbogadosEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbogadosEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbogadosEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
