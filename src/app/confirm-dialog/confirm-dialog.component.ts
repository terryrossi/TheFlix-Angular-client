import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 * A component for displaying a confirmation dialog.
 *
 * This dialog component is used to confirm a critical action, such as deleting the user profile.
 * It presents the user with an option to either confirm or cancel the action.
 *
 * @Component Decorator to define the following:
 * - selector: 'app-confirm-dialog'
 * - template: Inline HTML for the dialog's content, including buttons for confirm and cancel actions.
 */
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h1 mat-dialog-title>Confirm Action</h1>
    <div mat-dialog-content>
      <p>Are you sure you want to delete your profile?</p>
    </div>
    <div mat-dialog-actions>
      <button mat-button (click)="onDismiss()">Cancel</button>
      <button mat-button color="warn" (click)="onConfirm()">Delete</button>
    </div>
  `,
})
export class ConfirmDialogComponent {
  /**
   * Constructs the dialog component with a reference to the dialog itself.
   * @param dialogRef {MatDialogRef<ConfirmDialogComponent>} - Reference to the dialog.
   */
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  /**
   * Handles the confirmation action. Closes the dialog and returns true, indicating the action should proceed.
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * Handles the dismissal action. Closes the dialog and returns false, indicating the action should not proceed.
   */
  onDismiss(): void {
    this.dialogRef.close(false);
  }
}
