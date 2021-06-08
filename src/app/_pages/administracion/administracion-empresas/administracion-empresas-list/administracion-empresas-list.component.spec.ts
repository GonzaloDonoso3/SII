import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionEmpresasListComponent } from './administracion-empresas-list.component';

describe('AdministracionEmpresasListComponent', () => {
  let component: AdministracionEmpresasListComponent;
  let fixture: ComponentFixture<AdministracionEmpresasListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionEmpresasListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionEmpresasListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
