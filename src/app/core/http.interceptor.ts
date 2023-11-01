import { Injectable, Injector } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpErrorResponse
} from '@angular/common/http';

import { Observable, Subscription, throwError } from 'rxjs';
import { map, catchError, finalize, retry } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { SpinnerService } from './services/spinner.service';
// import { RollbarService } from '../app.module';
import { Router } from '@angular/router';

@Injectable()
export class HttpCustomInterceptor implements HttpInterceptor {
    constructor(private toast: ToastrService, private injector: Injector, private spinnerOverlayService: SpinnerService, private router:Router) { }
    intercept(request: HttpRequest<any>, next: HttpHandler,): Observable<any> {
        //subscribe to spinner service (show overlay and spinner)
        let spinnerSubscription: Subscription = this.spinnerOverlayService.spinner$.subscribe();
        return next.handle(request).pipe(
            retry(1), //retry request one time before throwing error
            map((event: HttpEvent<any>) => {
                return event;
            }),
            catchError((error: HttpErrorResponse) => {
                //send error data to rollbar and display message to user
                // const rollbar = this.injector.get(RollbarService);
                // this.toast.error(error.error.message ?? error.message);
                // rollbar.error(new Error(error.message).stack);
                //if not found redirect to not found page
                if(error.status === 404)
                    this.router.navigate(['/**']);
                return throwError(error);
            }),
            finalize(() => spinnerSubscription?.unsubscribe())); //unsubscibe from spinner service
    }
}
