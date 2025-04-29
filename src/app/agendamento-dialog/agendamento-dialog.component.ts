import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AgendamentoService, Agendamento } from '../services/agendamento.service';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-agendamento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './agendamento-dialog.component.html'
})
export class AgendamentoDialogComponent {
  agendamentoForm: FormGroup;
  statusOptions = ['PENDENTE', 'AGENDADO', 'EM USO', 'FINALIZADO'];
  motoristasMock = ['João Silva', 'Maria Souza', 'Paulo Oliveira'];
  loading = false;

  constructor(
    private fb: FormBuilder,
    private agendamentoService: AgendamentoService,
    private dialogRef: MatDialogRef<AgendamentoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Agendamento | null
  ) {
    this.agendamentoForm = this.fb.group({
      id: [data?.id],
      motorista: [data?.motoristaId || '', Validators.required],
      destino: [data?.destino || '', Validators.required],
      dataInicio: [data?.dataInicio || '', Validators.required],
      status: [data?.status || 'PENDENTE', Validators.required]
    });
  }

  salvar(): void {
    if (this.agendamentoForm.invalid) {
      this.agendamentoForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    const agendamento = this.agendamentoForm.value as Agendamento;

    if (agendamento.id) {
      this.agendamentoService.atualizar(agendamento).subscribe({
        next: () => {
          this.loading = false;
          this.dialogRef.close(true);
        },
        error: () => {
          this.loading = false;
        }
      });
    } else {
      this.agendamentoService.criar(agendamento).subscribe({
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
