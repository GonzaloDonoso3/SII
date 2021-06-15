import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNeumaticosEditComponent } from './dialog-neumaticos-edit.component';

describe('DialogNeumaticosEditComponent', () => {
  let component: DialogNeumaticosEditComponent;
  let fixture: ComponentFixture<DialogNeumaticosEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNeumaticosEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNeumaticosEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
