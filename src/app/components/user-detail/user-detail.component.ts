import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { UserListService } from '../../services/user-list.service';
import { LoadingService } from '../../core/services/loading.service';
import { CommonModule } from '@angular/common';
import { User } from '../../core/models';

@Component({
  selector: 'app-user-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.scss',
})
export class UserDetailComponent {
  user: User | null = null;
  loading$ = this.loadingService.loading$;
  error: string | null = null;
  userId: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserListService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.userId = +params['id'];
      if (this.userId) {
        this.loadUserDetails(this.userId);
      }
    });
  }

  loadUserDetails(id: number): void {
    this.error = null;
    this.userService.getUser(id).subscribe({
      next: (response) => {
        this.user = response.data;
      },
      error: (error) => {
        console.error('❌ Error loading user details:', error);
        this.error = 'User not found or failed to load user details.';
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  retry(): void {
    this.loadUserDetails(this.userId);
  }
}
