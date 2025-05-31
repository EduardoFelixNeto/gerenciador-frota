import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'admin',
    canActivate: [authGuard(['ADMINISTRADOR'])],
    loadComponent: () => import('./admin-home/admin-home.component').then(c => c.AdminHomeComponent),
  },
  {
    path: 'motorista',
    canActivate: [authGuard(['MOTORISTA'])],
    loadComponent: () => import('./motorista-home/motorista-home.component').then(c => c.MotoristaHomeComponent),
  },
  {
    path: 'acesso-negado',
    loadComponent: () => import('./acesso-negado/acesso-negado.component').then(c => c.AcessoNegadoComponent),
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
