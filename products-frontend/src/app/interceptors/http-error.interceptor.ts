import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Observable, catchError, throwError } from 'rxjs';
import { ErrorDialogComponent } from '../components/error-dialog/error-dialog.component';

@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {
    constructor(private readonly dialog: MatDialog) { }

    intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                const message = this.getErrorMessage(error);
                this.dialog.open(ErrorDialogComponent, {
                    data: { message },
                    autoFocus: false,
                });
                return throwError(() => error);
            })
        );
    }

    private getErrorMessage(error: HttpErrorResponse): string {
        if (error.error?.errors) {
            const firstKey = Object.keys(error.error?.errors)[0];
            return error.error.errors[firstKey];
        }

        if (error.error?.message) {
            return error.error.message;
        }

        if (error.status) {
            return `Request failed with status ${error.status}`;
        }

        return 'An unexpected error occurred.';
    }
}
