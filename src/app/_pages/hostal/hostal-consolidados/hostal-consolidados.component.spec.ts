import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HostalConsolidadosComponent } from './hostal-consolidados.component';

describe('HostalConsolidadosComponent', () => {
  let component: HostalConsolidadosComponent;
  let fixture: ComponentFixture<HostalConsolidadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HostalConsolidadosComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HostalConsolidadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
