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
import { ManutencaoService, Manutencao} from '../services/manutencao.service';
import { ManutencaoDialogComponent } from '../manutencao-dialog/manutencao-dialog.component';
import { ConfirmDialogComponent} from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-manutencao-list',
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
    ManutencaoDialogComponent,
    ConfirmDialogComponent
  ],
  templateUrl: './manutencao-list.component.html',
  styleUrls: ['./manutencao-list.component.css']
})
export class ManutencaoListComponent implements OnInit {
  displayedColumns: string[] = ['veiculoPlaca', 'dataManutencao', 'descricao', 'valor', 'acoes'];
  dataSource = new MatTableDataSource<Manutencao>();
  filtro: string = '';
  loading = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private manutencaoService: ManutencaoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.listarManutencoes();
  }

  listarManutencoes(): void {
    this.loading = true;
    this.manutencaoService.listar().subscribe({
      next: (data) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = (data: Manutencao, filter: string) => {
          return data.veiculo.placa.toLowerCase().includes(filter) ||
            data.descricao.toLowerCase().includes(filter);
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

  abrirDialog(manutencao?: Manutencao): void {
    const dialogRef = this.dialog.open(ManutencaoDialogComponent, {
      width: '400px',
      data: manutencao ? { ...manutencao } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Operação realizada com sucesso!', 'Fechar', { duration: 3000 });
        this.listarManutencoes();
      }
    });
  }

  excluirManutencao(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { mensagem: 'Deseja excluir esta manutenção?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.manutencaoService.excluir(id).subscribe({
          next: () => {
            this.snackBar.open('Manutenção excluída.', 'Fechar', { duration: 3000 });
            this.listarManutencoes();
          },
          error: () => {
            this.snackBar.open('Erro ao excluir manutenção.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
