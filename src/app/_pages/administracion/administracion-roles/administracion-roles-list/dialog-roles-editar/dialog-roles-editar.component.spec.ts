import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRolesEditarComponent } from './dialog-roles-editar.component';

describe('DialogRolesEditarComponent', () => {
  let component: DialogRolesEditarComponent;
  let fixture: ComponentFixture<DialogRolesEditarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRolesEditarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRolesEditarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
