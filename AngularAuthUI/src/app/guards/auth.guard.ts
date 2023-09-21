import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: "root"
})

export class authgaud implements CanActivate {

  constructor(private auth: AuthService) {

  }

  canActivate(): boolean {
    if (this.auth.isLoggedIn()) {
      return true
    } else {
      return false;
    }
  }

}






