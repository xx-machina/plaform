import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, Input, ViewChild } from '@angular/core';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'frames-drawer',
  standalone: true,
  imports: [
    CommonModule,
    MatSidenavModule,
  ],
  templateUrl: './drawer.frame.html',
  styleUrls: ['./drawer.frame.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DrawerFrame implements AfterViewInit {

  @ViewChild(MatDrawer)
  drawer!: MatDrawer;

  private _isOpen = false;

  @Input()
  set isOpen(_isOpen: boolean) {
    console.debug('isOpen:', _isOpen);
    console.debug('this.drawer:', this.drawer);
    _isOpen ? this.drawer?.open() : this.drawer?.close();
    this._isOpen = _isOpen
  }

  get isOpen(): boolean {
    return this._isOpen
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.isOpen ? this.drawer?.open() : this.drawer?.close();
      console.debug('this.drawer:', this.drawer);

    },0);
  }

}
