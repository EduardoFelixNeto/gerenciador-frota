import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { VeiculoService, Veiculo } from '../services/veiculo.service';
import { VeiculoDialogComponent } from '../veiculo-dialog/veiculo-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-veiculo-list',
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
    VeiculoDialogComponent,
    MatSnackBarModule,
    ConfirmDialogComponent
  ],
  templateUrl: './veiculo-list.component.html',
  styleUrls: ['./veiculo-list.component.css']
})
export class VeiculoListComponent implements OnInit {
  displayedColumns: string[] = ['placa', 'modelo', 'tipo', 'quilometragem', 'acoes'];
  dataSource = new MatTableDataSource<Veiculo>();
  filtro: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private veiculoService: VeiculoService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.listarVeiculos();
  }

  listarVeiculos(): void {
    this.veiculoService.listar().subscribe(data => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data: Veiculo, filter: string) => {
        return data.placa.toLowerCase().includes(filter) ||
          data.modelo.toLowerCase().includes(filter) ||
          data.tipo.toLowerCase().includes(filter);
      };
    });
  }

  aplicarFiltro(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
  }

  abrirDialog(veiculo?: Veiculo): void {
    const dialogRef = this.dialog.open(VeiculoDialogComponent, {
      width: '400px',
      data: veiculo ? { ...veiculo } : null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.snackBar.open('Operação realizada com sucesso!', 'Fechar', {duration: 3000});
        this.listarVeiculos();
      }
    });
  }

  excluirVeiculo(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '300px',
      data: { mensagem: 'Tem certeza que deseja excluir este veículo?' }
    });

    dialogRef.afterClosed().subscribe(confirmado => {
      if (confirmado) {
        this.veiculoService.excluir(id).subscribe({
          next: () => {
            this.snackBar.open('Veículo excluído com sucesso.', 'Fechar', { duration: 3000 });
            this.listarVeiculos();
          },
          error: () => {
            this.snackBar.open('Erro ao excluir veículo.', 'Fechar', { duration: 3000 });
          }
        });
      }
    });
  }
}
