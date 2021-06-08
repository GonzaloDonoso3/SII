import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionRolesFormComponent } from './administracion-roles-form.component';

describe('AdministracionRolesFormComponent', () => {
  let component: AdministracionRolesFormComponent;
  let fixture: ComponentFixture<AdministracionRolesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionRolesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionRolesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
