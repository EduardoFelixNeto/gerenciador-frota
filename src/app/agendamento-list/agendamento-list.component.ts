import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { AgendamentoService, Agendamento } from '../services/agendamento.service';
import { AgendamentoDialogComponent } from '../agendamento-dialog/agendamento-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-agendamento-list',
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
    AgendamentoDialogComponent,
    MatSnackBarModule,
    ConfirmDialogComponent
  ],
  templateUrl: './agendamento-list.component.html',
  styleUrls: ['./agendamento-list.component.css']
})
export class AgendamentoListComponent implements OnInit {
  displayedColumns: string[] = ['motorista', 'destino', 'dataInicio', 'status', 'acoes'];
  dataSource = new MatTableDataSource<Agendamento>();
  filtro: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private agendamentoService: AgendamentoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.listarAgendamentos();
  }

  listarAgendamentos(): void {
    this.agendamentoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: Agendamento, filter: string) => {
        return data.motorista.toLowerCase().includes(filter) ||
          data.destino.toLowerCase().includes(filter) ||
          data.status.toLowerCase().includes(filter);
      };
    });
  }

  aplicarFiltro(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

  abrirDialog(agendamento?: Agendamento): void {
    const dialogRef = this.dialog.open(AgendamentoDialogComponent, {
      width: '450px',
      data: agendamento ? { ...agendamento } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Operação realizada com sucesso!', 'Fechar', {duration: 3000});
        this.listarAgendamentos();
      }
    });
  }

  excluirAgendamento(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { mensagem: 'Tem certeza que deseja excluir este agendamento?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.agendamentoService.excluir(id).subscribe({
          next: () => {
            this.snackBar.open('Agendamento excluído com sucesso.', 'Fechar', { duration: 3000 });
            this.listarAgendamentos();
          },
          error: () => {
            this.snackBar.open('Erro ao excluir agendamento.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
