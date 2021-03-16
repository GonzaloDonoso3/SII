import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogDownloadsComponent } from './dialog-downloads.component';

describe('DialogDownloadsComponent', () => {
  let component: DialogDownloadsComponent;
  let fixture: ComponentFixture<DialogDownloadsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogDownloadsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogDownloadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
