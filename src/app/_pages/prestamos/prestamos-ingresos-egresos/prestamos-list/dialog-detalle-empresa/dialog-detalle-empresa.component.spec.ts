import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDetalleEmpresaComponent } from './dialog-detalle-empresa.component';

describe('DialogDetalleEmpresaComponent', () => {
  let component: DialogDetalleEmpresaComponent;
  let fixture: ComponentFixture<DialogDetalleEmpresaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDetalleEmpresaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDetalleEmpresaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
