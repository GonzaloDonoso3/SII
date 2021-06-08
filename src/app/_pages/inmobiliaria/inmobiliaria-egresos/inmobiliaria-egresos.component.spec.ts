import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmobiliariaEgresosComponent } from './inmobiliaria-egresos.component';

describe('InmobiliariaEgresosComponent', () => {
  let component: InmobiliariaEgresosComponent;
  let fixture: ComponentFixture<InmobiliariaEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InmobiliariaEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InmobiliariaEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
