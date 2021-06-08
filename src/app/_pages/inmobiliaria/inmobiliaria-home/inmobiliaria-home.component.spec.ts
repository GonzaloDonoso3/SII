import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InmobiliariaHomeComponent } from './inmobiliaria-home.component';

describe('InmobiliariaHomeComponent', () => {
  let component: InmobiliariaHomeComponent;
  let fixture: ComponentFixture<InmobiliariaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InmobiliariaHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InmobiliariaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
