import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  private progressSubject = new BehaviorSubject<number>(0);
  private requestCount = 0;

  loading$ = this.loadingSubject.asObservable();
  progress$ = this.progressSubject.asObservable();

  start(): void {
    this.requestCount++;

    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
      this.progressSubject.next(30);
    }
  }

  complete(): void {
    this.requestCount--;

    if (this.requestCount <= 0) {
      this.requestCount = 0;
      this.progressSubject.next(100);

      setTimeout(() => {
        this.loadingSubject.next(false);
        this.progressSubject.next(0);
      }, 200);
    }
  }
}
