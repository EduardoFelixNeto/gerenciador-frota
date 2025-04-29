import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Agendamento } from '../services/agendamento.service';

@Component({
  selector: 'app-ocorrencia-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './ocorrencia-dialog.component.html'
})
export class OcorrenciaDialogComponent {
  ocorrenciaForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<OcorrenciaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public agendamento: Agendamento
  ) {
    this.ocorrenciaForm = this.fb.group({
      descricao: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  enviar(): void {
    if (this.ocorrenciaForm.invalid) {
      this.ocorrenciaForm.markAllAsTouched();
      return;
    }

    this.loading = true;

    setTimeout(() => {
      this.loading = false;
      this.dialogRef.close(true);
    }, 2000); // simulação de envio (mock)
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
