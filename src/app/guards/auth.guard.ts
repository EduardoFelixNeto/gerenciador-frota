import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export function authGuard(authService: AuthService, router: Router): CanActivateFn {
  return () => {
    if (authService.isLoggedIn()) {
      return true;
    } else {
      router.navigate(['/login']);
      return false;
    }
  };
}
