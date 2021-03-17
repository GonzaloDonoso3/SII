import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmobiliariaEgresosFormComponent } from './inmobiliaria-egresos-form.component';

describe('InmobiliariaEgresosFormComponent', () => {
  let component: InmobiliariaEgresosFormComponent;
  let fixture: ComponentFixture<InmobiliariaEgresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InmobiliariaEgresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InmobiliariaEgresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
