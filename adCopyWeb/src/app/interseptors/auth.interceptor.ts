import { HttpInterceptorFn } from '@angular/common/http';
import { getAuth } from 'firebase/auth';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authInterceptorFn: HttpInterceptorFn = (req, next) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return from(user.getIdToken()).pipe(
      switchMap(token => {
        const cloned = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        });
        return next(cloned);
      })
    );
  }

  return next(req);
};
