import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmobiliariaIngresosFormComponent } from './inmobiliaria-ingresos-form.component';

describe('InmobiliariaIngresosFormComponent', () => {
  let component: InmobiliariaIngresosFormComponent;
  let fixture: ComponentFixture<InmobiliariaIngresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InmobiliariaIngresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InmobiliariaIngresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
