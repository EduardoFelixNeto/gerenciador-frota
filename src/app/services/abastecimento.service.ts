import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Abastecimento {
  id?: number;
  veiculoPlaca: string;
  dataAbastecimento: string;
  litros: number;
  valorTotal: number;
  kmAtual: number;
}

@Injectable({
  providedIn: 'root'
})
export class AbastecimentoService {
  private readonly apiUrl = 'http://localhost:3000/abastecimentos'; // seu json-server (ou backend)

  constructor(private http: HttpClient) {}

  listar(): Observable<Abastecimento[]> {
    return this.http.get<Abastecimento[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Abastecimento> {
    return this.http.get<Abastecimento>(`${this.apiUrl}/${id}`);
  }

  criar(abastecimento: Abastecimento): Observable<Abastecimento> {
    return this.http.post<Abastecimento>(this.apiUrl, abastecimento);
  }

  atualizar(abastecimento: Abastecimento): Observable<Abastecimento> {
    return this.http.put<Abastecimento>(`${this.apiUrl}/${abastecimento.id}`, abastecimento);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
