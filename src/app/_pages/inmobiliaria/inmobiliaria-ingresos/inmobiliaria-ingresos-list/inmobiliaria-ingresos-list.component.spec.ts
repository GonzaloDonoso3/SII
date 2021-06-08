import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmobiliariaIngresosListComponent } from './inmobiliaria-ingresos-list.component';

describe('InmobiliariaIngresosListComponent', () => {
  let component: InmobiliariaIngresosListComponent;
  let fixture: ComponentFixture<InmobiliariaIngresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InmobiliariaIngresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InmobiliariaIngresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
