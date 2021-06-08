import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogSucursalesEditarComponent } from './dialog-sucursales-editar.component';

describe('DialogSucursalesEditarComponent', () => {
  let component: DialogSucursalesEditarComponent;
  let fixture: ComponentFixture<DialogSucursalesEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogSucursalesEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogSucursalesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
