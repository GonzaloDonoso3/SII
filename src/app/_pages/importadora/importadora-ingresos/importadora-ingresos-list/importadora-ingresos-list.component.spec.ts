import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportadoraIngresosListComponent } from './importadora-ingresos-list.component';

describe('ImportadoraIngresosListComponent', () => {
  let component: ImportadoraIngresosListComponent;
  let fixture: ComponentFixture<ImportadoraIngresosListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportadoraIngresosListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportadoraIngresosListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
