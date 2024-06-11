import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../services/users/user.service';

export const tokenGuard: CanActivateFn = (route, state) => {
  let token = sessionStorage.getItem('token')
  const router = inject(Router)

  if (!token) { router.navigateByUrl('/login') }

  return true;
};
