import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostalEgresosCuotasComponent } from './hostal-egresos-cuotas.component';

describe('HostalEgresosCuotasComponent', () => {
  let component: HostalEgresosCuotasComponent;
  let fixture: ComponentFixture<HostalEgresosCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostalEgresosCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostalEgresosCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
