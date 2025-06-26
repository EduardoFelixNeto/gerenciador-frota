import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-fim-viagem-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>Finalizar Viagem</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" class="w-100">
        <mat-label>Quilometragem Final</mat-label>
        <input matInput type="number" [(ngModel)]="quilometragemFinal" required>
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-100">
        <mat-label>Observações</mat-label>
        <textarea matInput rows="3" [(ngModel)]="observacoes"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()" [disabled]="!quilometragemFinal">Confirmar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .w-100 { width: 100%; }
    mat-dialog-content { margin-top: 10px; }
  `]
})
export class FimViagemDialogComponent {
  quilometragemFinal: number = 0;
  observacoes: string = '';

  constructor(
    public dialogRef: MatDialogRef<FimViagemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmar(): void {
    this.dialogRef.close({
      quilometragemFinal: this.quilometragemFinal,
      observacoes: this.observacoes,
      dataFinal: new Date().toISOString(),
      statusAgenda: 'FINALIZADO'
    });
  }
}
