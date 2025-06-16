import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Veiculo {
  id?: number;
  placa: string;
  modelo: string;
  tipo: string;
  ano: number;
  quilometragemAtual: number;
  status: 'DISPONIVEL' | 'INATIVO' | 'EM_MANUTENCAO';
}

@Injectable({
  providedIn: 'root'
})
export class VeiculoService {
  private apiUrl = 'http://localhost:8080/api/veiculos';

  constructor(private http: HttpClient) {}

  listar(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(`${this.apiUrl}/getAll`);
  }

  buscarPorId(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(`${this.apiUrl}/${id}`);
  }

  criar(veiculo: Veiculo): Observable<Veiculo> {
    return this.http.post<Veiculo>(`${this.apiUrl}/create`, veiculo);
  }

  atualizar(veiculo: Veiculo): Observable<Veiculo> {
    return this.http.put<Veiculo>(`${this.apiUrl}/${veiculo.id}`, veiculo);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
