import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostalHomeComponent } from './hostal-home.component';

describe('HostalHomeComponent', () => {
  let component: HostalHomeComponent;
  let fixture: ComponentFixture<HostalHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostalHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostalHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
