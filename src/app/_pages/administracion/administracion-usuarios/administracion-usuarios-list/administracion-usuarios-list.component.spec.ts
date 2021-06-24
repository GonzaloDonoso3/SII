import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministracionUsuariosListComponent } from './administracion-usuarios-list.component';

describe('AdministracionUsuariosListComponent', () => {
  let component: AdministracionUsuariosListComponent;
  let fixture: ComponentFixture<AdministracionUsuariosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministracionUsuariosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministracionUsuariosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
