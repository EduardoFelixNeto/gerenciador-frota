import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AbastecimentoService, Abastecimento } from '../services/abastecimento.service';
import { AbastecimentoDialogComponent } from '../abastecimento-dialog/abastecimento-dialog.component';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-abastecimento-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatSnackBarModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressSpinnerModule,
    AbastecimentoDialogComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './abastecimento-list.component.html',
  styleUrls: ['./abastecimento-list.component.css']
})
export class AbastecimentoListComponent implements OnInit {
  displayedColumns: string[] = ['veiculo', 'data', 'valor', 'acoes'];
  dataSource = new MatTableDataSource<Abastecimento>();
  filtro: string = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private abastecimentoService: AbastecimentoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.listarAbastecimentos();
  }

  listarAbastecimentos(): void {
    this.loading = true;
    this.abastecimentoService.listar().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Abastecimento, filter: string) => {
          return data.veiculo.placa.toLowerCase().includes(filter);
        };
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  aplicarFiltro(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

  abrirDialog(abastecimento?: Abastecimento): void {
    const dialogRef = this.dialog.open(AbastecimentoDialogComponent, {
      width: '400px',
      data: abastecimento ? { ...abastecimento } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Operação realizada com sucesso!', 'Fechar', { duration: 3000 });
        this.listarAbastecimentos();
      }
    });
  }

  excluirAbastecimento(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { mensagem: 'Deseja excluir este abastecimento?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.abastecimentoService.excluir(id).subscribe({
          next: () => {
            this.snackBar.open('Abastecimento excluído.', 'Fechar', { duration: 3000 });
            this.listarAbastecimentos();
          },
          error: () => {
            this.snackBar.open('Erro ao excluir abastecimento.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
