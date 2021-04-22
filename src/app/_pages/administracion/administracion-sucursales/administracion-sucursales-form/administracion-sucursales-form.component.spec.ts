import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionSucursalesFormComponent } from './administracion-sucursales-form.component';

describe('AdministracionSucursalesFormComponent', () => {
  let component: AdministracionSucursalesFormComponent;
  let fixture: ComponentFixture<AdministracionSucursalesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionSucursalesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionSucursalesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
