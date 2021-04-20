import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogContratosComponent } from './dialog-contratos.component';

describe('DialogContratosComponent', () => {
  let component: DialogContratosComponent;
  let fixture: ComponentFixture<DialogContratosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogContratosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogContratosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
