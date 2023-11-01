import { HttpErrorResponse } from "@angular/common/http";

export const initialNotificationState: HttpErrorResponse = new HttpErrorResponse({
    error: null,
    headers: undefined,
    status: 0,
    statusText: 'Initial Error',
    url: undefined
  });