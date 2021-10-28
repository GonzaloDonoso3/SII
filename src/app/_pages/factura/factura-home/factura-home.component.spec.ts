import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturaHomeComponent } from './factura-home.component';

describe('FacturaHomeComponent', () => {
  let component: FacturaHomeComponent;
  let fixture: ComponentFixture<FacturaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FacturaHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
