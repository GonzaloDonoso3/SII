import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionUsuariosFormComponent } from './administracion-usuarios-form.component';

describe('AdministracionUsuariosFormComponent', () => {
  let component: AdministracionUsuariosFormComponent;
  let fixture: ComponentFixture<AdministracionUsuariosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionUsuariosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionUsuariosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
