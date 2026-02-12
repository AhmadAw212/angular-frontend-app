import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User, UserDetailResponse, UsersListResponse } from '../core/models';
import { CacheService } from '../core/services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class UserListService {
  private readonly API_URL = environment.reqresApiUrl;
  private readonly CACHE_TTL = 5 * 60 * 1000;

  constructor(private http: HttpClient, private cacheService: CacheService) {}

  getUsers(page: number = 1): Observable<UsersListResponse> {
    const cacheKey = `users_page_${page}`;
    return this.cacheService.cacheObservable(
      cacheKey,
      this.http
        .get<UsersListResponse>(`${this.API_URL}/users?page=${page}`)
        .pipe(
          catchError((error) => {
            return throwError(() => error);
          })
        ),
      this.CACHE_TTL
    );
  }

  getUser(id: number): Observable<UserDetailResponse> {
    const cacheKey = `user_${id}`;
    return this.cacheService.cacheObservable(
      cacheKey,
      this.http.get<UserDetailResponse>(`${this.API_URL}/users/${id}`).pipe(
        catchError((error) => {
          return throwError(() => error);
        })
      ),
      this.CACHE_TTL
    );
  }

  getAllUsers(): Observable<User[]> {
    const cacheKey = 'all_users';
    return this.cacheService.cacheObservable(
      cacheKey,
      this.http.get<UsersListResponse>(`${this.API_URL}/users`).pipe(
        map((response) => response.data),
        catchError((error) => {
          return throwError(() => error);
        })
      ),
      this.CACHE_TTL
    );
  }

  clearCache(): void {
    this.cacheService.clear();
  }

  getCacheStats() {
    return this.cacheService.getStats();
  }
}
