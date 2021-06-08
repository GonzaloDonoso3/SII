import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogMostrarContratosComponent } from './dialog-mostrar-contratos.component';

describe('DialogMostrarContratosComponent', () => {
  let component: DialogMostrarContratosComponent;
  let fixture: ComponentFixture<DialogMostrarContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogMostrarContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogMostrarContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
