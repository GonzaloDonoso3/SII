import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionEmpresasFormComponent } from './administracion-empresas-form.component';

describe('AdministracionEmpresasFormComponent', () => {
  let component: AdministracionEmpresasFormComponent;
  let fixture: ComponentFixture<AdministracionEmpresasFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionEmpresasFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionEmpresasFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
