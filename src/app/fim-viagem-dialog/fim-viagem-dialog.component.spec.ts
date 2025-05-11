import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FimViagemDialogComponent } from './fim-viagem-dialog.component';

describe('FimViagemDialogComponent', () => {
  let component: FimViagemDialogComponent;
  let fixture: ComponentFixture<FimViagemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FimViagemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FimViagemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
