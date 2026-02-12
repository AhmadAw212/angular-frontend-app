import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

export const apiKeyInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.url.includes('reqres.in')) {
    const clonedRequest = req.clone({
      setHeaders: {
        'x-api-key': environment.reqresApiKey,
      },
    });
    return next(clonedRequest);
  }

  return next(req);
};
