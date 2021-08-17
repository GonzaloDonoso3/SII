import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LubricentroEgresosCuotasComponent } from './lubricentro-egresos-cuotas.component';

describe('LubricentroEgresosCuotasComponent', () => {
  let component: LubricentroEgresosCuotasComponent;
  let fixture: ComponentFixture<LubricentroEgresosCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LubricentroEgresosCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LubricentroEgresosCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
