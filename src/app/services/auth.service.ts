import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, of, tap} from 'rxjs';

export interface AuthResponse {
  token: string;
  perfil: 'ADMINISTRADOR' | 'MOTORISTA';
  nome: string;
  id: number;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<any> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios?email=${email}&senha=${senha}`).pipe(
      map(usuarios => {
        if (usuarios.length > 0) {
          return {
            token: 'fake-jwt-token',
            perfil: usuarios[0].perfil,
            nome: usuarios[0].nome,
            id: usuarios[0].id
          };
        } else {
          throw new Error('E-mail ou senha inválidos');
        }
      }),
      tap(user => {
        localStorage.setItem('token', user.token);
        localStorage.setItem('perfil', user.perfil);
        localStorage.setItem('nome', user.nome);
        localStorage.setItem('id', String(user.id));
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('perfil');
    localStorage.removeItem('nome');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getPerfil(): string | null {
    return localStorage.getItem('perfil');
  }

  getNome(): string | null {
    return localStorage.getItem('nome');
  }

  getId(): number | null{
    const id = localStorage.getItem('id');
    return id ? parseInt(id, 10) : 0;
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }

  getUsuarioLogado(): { nome: string; perfil: string; id: number } | null {
    const token = this.getToken();
    const perfil = this.getPerfil();
    const nome = this.getNome();
    const id = this.getId();

    console.log(`Token: ${token}, Perfil: ${perfil}, Nome: ${nome}, ID: ${id}`);

    if (token && perfil && nome && id) {
      return { nome, perfil, id };
    }
    return null;
  }

}
