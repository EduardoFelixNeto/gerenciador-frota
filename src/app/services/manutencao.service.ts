import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Veiculo} from './veiculo.service';

export interface Manutencao {
  id?: number;
  veiculo: Veiculo;
  data: string;
  descricao: string;
  valor: number;
  tipo: 'PREVENTIVA' | 'CORRETIVA'; // Tipos de manutenção
  quilometragem: number; // Quilometragem do veículo no momento da manutenção
}

@Injectable({
  providedIn: 'root'
})
export class ManutencaoService {
  private readonly apiUrl = 'http://localhost:8080/api/manutencao'; // json-server (ou backend)

  constructor(private http: HttpClient) {}

  listar(): Observable<Manutencao[]> {
    return this.http.get<Manutencao[]>(this.apiUrl + '/getAll');
  }

  buscarPorId(id: number): Observable<Manutencao> {
    return this.http.get<Manutencao>(`${this.apiUrl}/${id}`);
  }

  criar(manutencao: Manutencao): Observable<Manutencao> {
    return this.http.post<Manutencao>(this.apiUrl + '/create', manutencao);
  }

  atualizar(manutencao: Manutencao): Observable<Manutencao> {
    return this.http.put<Manutencao>(`${this.apiUrl}/update/${manutencao.id}`, manutencao);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`);
  }
}
