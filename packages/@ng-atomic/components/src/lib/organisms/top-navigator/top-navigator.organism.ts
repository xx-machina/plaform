import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Action } from '@ng-atomic/common/models';
import { SmartMenuButtonAtom } from '@ng-atomic/components/atoms/smart-menu-button';


@Component({
  selector: 'organisms-top-navigator',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatMenuModule,
    SmartMenuButtonAtom,
  ],
  templateUrl: './top-navigator.organism.html',
  styleUrls: ['./top-navigator.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TopNavigatorOrganism {

  @Input()
  title?: string;

  @Input()
  items: Action[] = [];

  @Output()
  action = new EventEmitter<Action>();
  
  id = (item: {id: string}) => item.id;

}
