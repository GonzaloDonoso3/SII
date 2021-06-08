import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostalEgresosListComponent } from './hostal-egresos-list.component';

describe('HostalEgresosListComponent', () => {
  let component: HostalEgresosListComponent;
  let fixture: ComponentFixture<HostalEgresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostalEgresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostalEgresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
