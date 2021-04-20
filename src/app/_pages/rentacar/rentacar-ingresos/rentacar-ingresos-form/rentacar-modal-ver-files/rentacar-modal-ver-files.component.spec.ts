import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentacarModalVerFilesComponent } from './rentacar-modal-ver-files.component';

describe('RentacarModalVerFilesComponent', () => {
  let component: RentacarModalVerFilesComponent;
  let fixture: ComponentFixture<RentacarModalVerFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RentacarModalVerFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RentacarModalVerFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
