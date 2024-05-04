import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'organisms-social-login-section',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
  ],
  templateUrl: './social-login-section.organism.html',
  styleUrls: ['./social-login-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SocialLoginSectionOrganism {

  @Output()
  signInWithGoogleButtonClick = new EventEmitter<void>();
  
}
