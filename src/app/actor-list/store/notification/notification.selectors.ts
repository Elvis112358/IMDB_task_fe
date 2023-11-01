import { HttpErrorResponse } from "@angular/common/http";
import { createFeatureSelector } from "@ngrx/store";

export const selectNotifications = createFeatureSelector<HttpErrorResponse>('notification');