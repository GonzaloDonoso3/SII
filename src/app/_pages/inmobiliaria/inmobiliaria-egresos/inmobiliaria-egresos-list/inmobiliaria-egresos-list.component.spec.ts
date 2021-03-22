import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmobiliariaEgresosListComponent } from './inmobiliaria-egresos-list.component';

describe('InmobiliariaEgresosListComponent', () => {
  let component: InmobiliariaEgresosListComponent;
  let fixture: ComponentFixture<InmobiliariaEgresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InmobiliariaEgresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InmobiliariaEgresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
