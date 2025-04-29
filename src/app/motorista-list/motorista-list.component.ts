import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MotoristaService, Motorista } from '../services/motorista.service';
import { MotoristaDialogComponent } from '../motorista-dialog/motorista-dialog.component';
import { MatSnackBar, MatSnackBarModule} from '@angular/material/snack-bar';
import {ConfirmDialogComponent} from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-motorista-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatPaginatorModule,
    MatSortModule,
    MotoristaDialogComponent,
    MatSnackBarModule,
    ConfirmDialogComponent
  ],
  templateUrl: './motorista-list.component.html',
  styleUrls: ['./motorista-list.component.css']
})
export class MotoristaListComponent implements OnInit {
  displayedColumns: string[] = ['nome', 'cpf', 'telefone', 'acoes'];
  dataSource = new MatTableDataSource<Motorista>();
  filtro: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private motoristaService: MotoristaService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.listarMotoristas();
  }

  listarMotoristas(): void {
    this.motoristaService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: Motorista, filter: string) => {
        return data.nome.toLowerCase().includes(filter) ||
          data.cpf.toLowerCase().includes(filter) ||
          data.telefone.toLowerCase().includes(filter);
      };
    });
  }

  aplicarFiltro(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

  abrirDialog(motorista?: Motorista): void {
    const dialogRef = this.dialog.open(MotoristaDialogComponent, {
      width: '400px',
      data: motorista ? {...motorista} : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Operação realizada com sucesso!', 'Fechar', {duration: 3000});
        this.listarMotoristas();
      }
    });
  }

  excluirMotorista(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { mensagem: 'Tem certeza que deseja excluir este motorista?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.motoristaService.excluir(id).subscribe({
          next: () => {
            this.snackBar.open('Motorista excluído com sucesso.', 'Fechar', { duration: 3000 });
            this.listarMotoristas();
          },
          error: () => {
            this.snackBar.open('Erro ao excluir motorista.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
