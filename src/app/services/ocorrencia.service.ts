import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Ocorrencia {
  id?: number;
  motoristaId: number;
  veiculoId: number;
  descricao?: string;
}


@Injectable({
  providedIn: 'root'
})
export class OcorrenciaService {
  private apiUrl = 'http://localhost:3000/ocorrencias';

  constructor(private http: HttpClient) {}

  listar(): Observable<Ocorrencia[]> {
    return this.http.get<Ocorrencia[]>(this.apiUrl);
  }

  buscarPorId(id: number): Observable<Ocorrencia> {
    return this.http.get<Ocorrencia>(`${this.apiUrl}/${id}`);
  }

  criar(ocorrencia: Ocorrencia): Observable<Ocorrencia> {
    return this.http.post<Ocorrencia>(this.apiUrl, ocorrencia);
  }

  atualizar(ocorrencia: Ocorrencia): Observable<Ocorrencia> {
    return this.http.put<Ocorrencia>(`${this.apiUrl}/${ocorrencia.id}`, ocorrencia);
  }

  excluir(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
