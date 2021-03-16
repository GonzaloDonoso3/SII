import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogRespaldosComponent } from './dialog-respaldos.component';

describe('DialogRespaldosComponent', () => {
  let component: DialogRespaldosComponent;
  let fixture: ComponentFixture<DialogRespaldosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogRespaldosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogRespaldosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
