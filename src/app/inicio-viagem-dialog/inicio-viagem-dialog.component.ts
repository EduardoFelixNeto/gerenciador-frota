import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-inicio-viagem-dialog',
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
    <h2 mat-dialog-title>Iniciar Viagem</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill" class="w-100">
        <mat-label>Quilometragem de Saída</mat-label>
        <input matInput type="number" [(ngModel)]="quilometragemInicial" required>
      </mat-form-field>

      <mat-form-field appearance="fill" class="w-100">
        <mat-label>Observações</mat-label>
        <textarea matInput rows="3" [(ngModel)]="observacaoInicio"></textarea>
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">Cancelar</button>
      <button mat-raised-button color="primary" (click)="confirmar()" [disabled]="!quilometragemInicial">Confirmar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .w-100 { width: 100%; }
    mat-dialog-content { margin-top: 10px; }
  `]
})
export class InicioViagemDialogComponent {
  quilometragemInicial: number = 0;
  observacaoInicio: string = '';

  constructor(
    public dialogRef: MatDialogRef<InicioViagemDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  confirmar(): void {
    this.dialogRef.close({
      quilometragemInicial: this.quilometragemInicial,
      observacaoInicio: this.observacaoInicio,
      dataInicio: new Date().toISOString(),
      statusAgenda: 'EM_USO'
    });
  }
}
