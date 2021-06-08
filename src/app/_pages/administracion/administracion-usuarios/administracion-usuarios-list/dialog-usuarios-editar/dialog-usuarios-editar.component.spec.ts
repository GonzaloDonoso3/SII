import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogUsuariosEditarComponent } from './dialog-usuarios-editar.component';

describe('DialogUsuariosEditarComponent', () => {
  let component: DialogUsuariosEditarComponent;
  let fixture: ComponentFixture<DialogUsuariosEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogUsuariosEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogUsuariosEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
