import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionRolesListComponent } from './administracion-roles-list.component';

describe('AdministracionRolesListComponent', () => {
  let component: AdministracionRolesListComponent;
  let fixture: ComponentFixture<AdministracionRolesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionRolesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionRolesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
