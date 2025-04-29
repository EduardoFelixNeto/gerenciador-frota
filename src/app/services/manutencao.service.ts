import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Manutencao {
  id?: number;
  veiculoPlaca: string;
  dataManutencao: string;
  descricao: string;
  valor: number;
}

@Injectable({
  providedIn: 'root'
})
export class ManutencaoService {
  private readonly apiUrl = 'http://localhost:3000/manutencoes'; // json-server (ou backend)

  constructor(private http: HttpClient) {}

  listar(): Observable<Manutencao[]> {
    return this.http.get<Manutencao[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Manutencao> {
    return this.http.get<Manutencao>(`${this.apiUrl}/${id}`);
  }

  criar(manutencao: Manutencao): Observable<Manutencao> {
    return this.http.post<Manutencao>(this.apiUrl, manutencao);
  }

  atualizar(manutencao: Manutencao): Observable<Manutencao> {
    return this.http.put<Manutencao>(`${this.apiUrl}/${manutencao.id}`, manutencao);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
