import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraHomeComponent } from './importadora-home.component';

describe('ImportadoraHomeComponent', () => {
  let component: ImportadoraHomeComponent;
  let fixture: ComponentFixture<ImportadoraHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
