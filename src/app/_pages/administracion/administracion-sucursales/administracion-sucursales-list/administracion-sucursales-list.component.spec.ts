import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionSucursalesListComponent } from './administracion-sucursales-list.component';

describe('AdministracionSucursalesListComponent', () => {
  let component: AdministracionSucursalesListComponent;
  let fixture: ComponentFixture<AdministracionSucursalesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionSucursalesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionSucursalesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
