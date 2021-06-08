import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionSucursalesComponent } from './administracion-sucursales.component';

describe('AdministracionSucursalesComponent', () => {
  let component: AdministracionSucursalesComponent;
  let fixture: ComponentFixture<AdministracionSucursalesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionSucursalesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionSucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
