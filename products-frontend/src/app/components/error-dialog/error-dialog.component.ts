import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-error-dialog',
    templateUrl: './error-dialog.component.html',
    imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
})
export class ErrorDialogComponent {
    constructor(@Inject(MAT_DIALOG_DATA) public readonly data: { message: string }) { }
}
