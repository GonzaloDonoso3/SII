import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmobiliariaIngresosComponent } from './inmobiliaria-ingresos.component';

describe('InmobiliariaIngresosComponent', () => {
  let component: InmobiliariaIngresosComponent;
  let fixture: ComponentFixture<InmobiliariaIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InmobiliariaIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InmobiliariaIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
