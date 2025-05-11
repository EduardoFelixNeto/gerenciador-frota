import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InicioViagemDialogComponent } from './inicio-viagem-dialog.component';

describe('InicioViagemDialogComponent', () => {
  let component: InicioViagemDialogComponent;
  let fixture: ComponentFixture<InicioViagemDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InicioViagemDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InicioViagemDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
