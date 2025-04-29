import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MotoristaService, Motorista } from '../services/motorista.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-motorista-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './motorista-dialog.component.html',
})
export class MotoristaDialogComponent {
  motoristaForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private motoristaService: MotoristaService,
    private dialogRef: MatDialogRef<MotoristaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Motorista | null
  ) {
    this.motoristaForm = this.fb.group({
      id: [data?.id],
      nome: [data?.nome || '', Validators.required],
      cpf: [data?.cpf || '', Validators.required],
      cnh: [data?.cnh || '', Validators.required],
      validadeCnh: [data?.validadeCnh || '', Validators.required],
      telefone: [data?.telefone || '', Validators.required],
      endereco: [data?.endereco || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]]
    });
  }

  salvar(): void {
    if (this.motoristaForm.invalid) {
      this.motoristaForm.markAllAsTouched(); // força mostrar os erros
      return;
    }

    this.loading = true;
    const motorista = this.motoristaForm.value as Motorista;

    if (motorista.id) {
      this.motoristaService.atualizar(motorista).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.motoristaService.criar(motorista).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
