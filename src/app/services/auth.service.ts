import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, tap} from 'rxjs';

export interface AuthResponse {
  jwt: string;
  user: User;
}

export interface User {
  id: number;
  nome: string;
  email: string;
  perfil: 'ADMIN' | 'MOTORISTA';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api';
  private currentUser: User | null = null;

  constructor(private http: HttpClient) {}

  login(email: string, senha: string): Observable<User> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/auth/login`, { email, senha }).pipe(
      tap(res => localStorage.setItem('token', res.jwt)),
      map(res => {
        this.currentUser = res.user;
        return res.user;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUser = null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getUsuarioLogado(): User | null {
    return this.currentUser;
  }

  getNome(): string | null {
    return this.currentUser?.nome ?? null;
  }

  getPerfil(): string | null {
    return this.currentUser?.perfil ?? null;
  }
}
