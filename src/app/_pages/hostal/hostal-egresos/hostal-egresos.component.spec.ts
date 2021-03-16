import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostalEgresosComponent } from './hostal-egresos.component';

describe('HostalEgresosComponent', () => {
  let component: HostalEgresosComponent;
  let fixture: ComponentFixture<HostalEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostalEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostalEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
