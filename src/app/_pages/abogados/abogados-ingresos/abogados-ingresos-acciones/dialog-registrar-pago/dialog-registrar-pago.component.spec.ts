import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRegistrarPagoComponent } from './dialog-registrar-pago.component';

describe('DialogRegistrarPagoComponent', () => {
  let component: DialogRegistrarPagoComponent;
  let fixture: ComponentFixture<DialogRegistrarPagoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRegistrarPagoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRegistrarPagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
