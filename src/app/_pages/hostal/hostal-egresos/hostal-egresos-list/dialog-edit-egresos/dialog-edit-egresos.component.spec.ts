import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogEditEgresosComponent } from './dialog-edit-egresos.component';

describe('DialogEditEgresosComponent', () => {
  let component: DialogEditEgresosComponent;
  let fixture: ComponentFixture<DialogEditEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogEditEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogEditEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
