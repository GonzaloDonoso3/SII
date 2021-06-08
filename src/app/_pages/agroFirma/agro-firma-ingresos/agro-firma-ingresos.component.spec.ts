import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgroFirmaIngresosComponent } from './agro-firma-ingresos.component';

describe('AgroFirmaIngresosComponent', () => {
  let component: AgroFirmaIngresosComponent;
  let fixture: ComponentFixture<AgroFirmaIngresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgroFirmaIngresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgroFirmaIngresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
