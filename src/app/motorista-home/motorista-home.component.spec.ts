import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MotoristaHomeComponent } from './motorista-home.component';

describe('MotoristaHomeComponent', () => {
  let component: MotoristaHomeComponent;
  let fixture: ComponentFixture<MotoristaHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MotoristaHomeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MotoristaHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
