import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Agendamento } from '../services/agendamento.service';

@Component({
  selector: 'app-visualizar-agendamento-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './visualizar-agendamento-dialog.component.html'
})
export class VisualizarAgendamentoDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public agendamento: Agendamento,
    private dialogRef: MatDialogRef<VisualizarAgendamentoDialogComponent>
  ) {}

  fechar(): void {
    this.dialogRef.close();
  }
}
