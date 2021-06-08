import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostalEgresosFormComponent } from './hostal-egresos-form.component';

describe('HostalEgresosFormComponent', () => {
  let component: HostalEgresosFormComponent;
  let fixture: ComponentFixture<HostalEgresosFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostalEgresosFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostalEgresosFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
