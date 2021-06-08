import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionEmpresasComponent } from './administracion-empresas.component';

describe('AdministracionEmpresasComponent', () => {
  let component: AdministracionEmpresasComponent;
  let fixture: ComponentFixture<AdministracionEmpresasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionEmpresasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionEmpresasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
