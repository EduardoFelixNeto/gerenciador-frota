import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManutencaoDialogComponent } from './manutencao-dialog.component';

describe('ManutencaoDialogComponent', () => {
  let component: ManutencaoDialogComponent;
  let fixture: ComponentFixture<ManutencaoDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManutencaoDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManutencaoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
