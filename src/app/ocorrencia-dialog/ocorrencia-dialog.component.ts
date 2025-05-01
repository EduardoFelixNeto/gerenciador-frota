import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { OcorrenciaService, Ocorrencia } from '../services/ocorrencia.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  standalone: true,
  selector: 'app-ocorrencia-dialog',
  templateUrl: './ocorrencia-dialog.component.html',
  styleUrls: ['./ocorrencia-dialog.component.css'],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    MatProgressSpinner
  ]
})
export class OcorrenciaDialogComponent {
  descricao: string = '';
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any, // espera { motoristaId, veiculoId }
    private dialogRef: MatDialogRef<OcorrenciaDialogComponent>,
    private ocorrenciaService: OcorrenciaService,
    private snackBar: MatSnackBar
  ) {}

  enviar(): void {
    if (!this.descricao.trim()) return;

    const ocorrencia: Ocorrencia = {
      motoristaId: this.data.motoristaId,
      veiculoId: this.data.veiculoId,
      descricao: this.descricao
    };

    this.loading = true;
    this.ocorrenciaService.criar(ocorrencia).subscribe({
      next: () => {
        this.loading = false;
        this.snackBar.open('Ocorrência registrada com sucesso!', 'Fechar', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: () => {
        this.loading = false;
        this.snackBar.open('Erro ao registrar ocorrência.', 'Fechar', { duration: 3000 });
      }
    });
  }

  cancelar(): void {
    this.dialogRef.close(false);
  }
}
