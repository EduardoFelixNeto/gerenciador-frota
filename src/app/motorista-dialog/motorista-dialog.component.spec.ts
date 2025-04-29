import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaDialogComponent } from './motorista-dialog.component';

describe('MotoristaDialogComponent', () => {
  let component: MotoristaDialogComponent;
  let fixture: ComponentFixture<MotoristaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoristaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
