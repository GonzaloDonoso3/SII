import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraEgresosComponent } from './importadora-egresos.component';

describe('ImportadoraEgresosComponent', () => {
  let component: ImportadoraEgresosComponent;
  let fixture: ComponentFixture<ImportadoraEgresosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraEgresosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraEgresosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
