import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaIngresosFormComponent } from './agro-firma-ingresos-form.component';

describe('AgroFirmaIngresosFormComponent', () => {
  let component: AgroFirmaIngresosFormComponent;
  let fixture: ComponentFixture<AgroFirmaIngresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaIngresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaIngresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});