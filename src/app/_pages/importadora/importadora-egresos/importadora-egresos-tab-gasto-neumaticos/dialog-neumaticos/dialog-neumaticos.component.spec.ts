import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogNeumaticosComponent } from './dialog-neumaticos.component';

describe('DialogNeumaticosComponent', () => {
  let component: DialogNeumaticosComponent;
  let fixture: ComponentFixture<DialogNeumaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogNeumaticosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogNeumaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
