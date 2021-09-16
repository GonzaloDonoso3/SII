import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaEgresosCuotasComponent } from './agro-firma-egresos-cuotas.component';

describe('AgroFirmaEgresosCuotasComponent', () => {
  let component: AgroFirmaEgresosCuotasComponent;
  let fixture: ComponentFixture<AgroFirmaEgresosCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaEgresosCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaEgresosCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
