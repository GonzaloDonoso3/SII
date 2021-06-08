import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEmpresasEditarComponent } from './dialog-empresas-editar.component';

describe('DialogEmpresasEditarComponent', () => {
  let component: DialogEmpresasEditarComponent;
  let fixture: ComponentFixture<DialogEmpresasEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEmpresasEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEmpresasEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
