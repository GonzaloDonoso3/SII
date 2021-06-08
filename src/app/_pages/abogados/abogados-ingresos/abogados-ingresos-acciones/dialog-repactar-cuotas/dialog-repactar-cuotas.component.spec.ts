import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRepactarCuotasComponent } from './dialog-repactar-cuotas.component';

describe('DialogRepactarCuotasComponent', () => {
  let component: DialogRepactarCuotasComponent;
  let fixture: ComponentFixture<DialogRepactarCuotasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRepactarCuotasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRepactarCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
