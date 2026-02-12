import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const messageService = inject(MessageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = '';
      let severity: 'error' | 'warn' | 'info' = 'error';

      if (error.error instanceof ErrorEvent) {
        errorMessage = `Client Error: ${error.error.message}`;
        console.error('❌ Client-side error:', error.error.message);
      } else {
        switch (error.status) {
          case 400:
            errorMessage = 'Bad Request: Please check your input';
            severity = 'warn';
            break;
          case 401:
            errorMessage = 'Unauthorized: Please log in';
            severity = 'warn';
            break;
          case 403:
            errorMessage = 'Forbidden: You do not have permission';
            severity = 'error';
            break;
          case 404:
            errorMessage = 'Not Found: The requested resource does not exist';
            severity = 'error';
            break;
          case 500:
            errorMessage = 'Server Error: Please try again later';
            severity = 'error';
            break;
          case 503:
            errorMessage = 'Service Unavailable: Please try again later';
            severity = 'error';
            break;
          default:
            errorMessage = `Error ${error.status}: ${error.message}`;
            severity = 'error';
        }
        console.error(
          `❌ Server-side error: Status ${error.status}, Message: ${error.message}`
        );
      }

      messageService.add({
        severity: severity,
        summary: 'Error',
        detail: errorMessage,
        life: 5000,
      });

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        originalError: error,
      }));
    })
  );
};
