// src/app/guards/auth.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function authGuard(perfisPermitidos: string[] = []): CanActivateFn {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isLoggedIn()) {
      router.navigate(['/login']);
      return false;
    }

    if (perfisPermitidos.length > 0) {
      const perfilUsuario = authService.getPerfil();
      if (!perfilUsuario || !perfisPermitidos.includes(perfilUsuario)) {
        router.navigate(['/acesso-negado']);
        return false;
      }
    }

    return true;
  };
}
