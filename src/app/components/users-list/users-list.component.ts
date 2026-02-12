import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
} from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { SkeletonModule } from 'primeng/skeleton';

import { Router } from '@angular/router';
import {
  catchError,
  debounceTime,
  EMPTY,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { User, UserDetailResponse, UsersListResponse } from '../../core/models';
import { LoadingService } from '../../core/services/loading.service';
import { UserListService } from '../../services/user-list.service';

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    CardModule,
    PaginatorModule,
    SkeletonModule,
    AvatarModule,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss',
})
export class UsersListComponent implements OnInit, OnDestroy {
  users: User[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  perPage: number = 0;
  total: number = 0;
  loading$ = this.loadingService.loading$;

  searchQuery: string = '';
  searchResult: User | null = null;
  searchError: string | null = null;
  isSearching: boolean = false;
  private searchSubject = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private usersService: UserListService,
    private loadingService: LoadingService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    this.loadUsers(this.currentPage);
    this.setupSearch();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  setupSearch(): void {
    this.searchSubject
      .pipe(
        debounceTime(500),
        takeUntil(this.destroy$),
        switchMap((query) => {
          const userId = parseInt(query.trim());

          if (!query.trim() || isNaN(userId)) {
            this.searchResult = null;
            this.searchError = null;
            this.isSearching = false;
            return EMPTY;
          }

          this.isSearching = true;
          this.searchError = null;

          return this.usersService.getUser(userId).pipe(
            catchError((error) => {
              this.searchResult = null;
              this.searchError = error.message;
              this.isSearching = false;
              return EMPTY;
            })
          );
        })
      )
      .subscribe({
        next: (response: UserDetailResponse) => {
          if (response && response.data) {
            this.searchResult = response.data;
            this.searchError = null;
          }
          this.isSearching = false;
        },
      });
  }

  onSearchInput(value: string): void {
    this.searchSubject.next(value);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.searchResult = null;
    this.searchError = null;
    this.isSearching = false;
    this.searchSubject.next('');
  }

  navigateToUser(userId: number): void {
    this.clearSearch();
    this.router.navigate(['/user', userId]);
  }

  loadUsers(page: number): void {
    this.usersService.getUsers(page).subscribe({
      next: (response: UsersListResponse) => {
        this.users = response.data;
        this.currentPage = response.page;
        this.totalPages = response.total_pages;
        this.perPage = response.per_page;
        this.total = response.total;

        if (isPlatformBrowser(this.platformId)) {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      },
      error: (error) => {
        console.error('❌ Error loading users:', error);
      },
    });
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== -1) {
      this.loadUsers(page);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;

    if (this.totalPages <= maxVisible + 2) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, this.currentPage - 1);
      let end = Math.min(this.totalPages - 1, this.currentPage + 1);

      if (this.currentPage <= 3) {
        start = 2;
        end = Math.min(4, this.totalPages - 1);
      }

      if (this.currentPage >= this.totalPages - 2) {
        start = Math.max(2, this.totalPages - 3);
        end = this.totalPages - 1;
      }

      if (start > 2) {
        pages.push(-1);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < this.totalPages - 1) {
        pages.push(-1);
      }

      pages.push(this.totalPages);
    }

    return pages;
  }

  loadAllUsers(): void {
    this.usersService.getAllUsers().subscribe({
      next: (allUsers: User[]) => {
        this.users = allUsers;
        this.total = allUsers.length;
        this.currentPage = 1;
        this.totalPages = 1;
      },
      error: (error) => {
        console.error('❌ Error loading all users:', error);
      },
    });
  }

  getUserById(id: number): void {
    this.navigateToUser(id);
  }
}
