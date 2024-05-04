import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';
import { Action } from '@ng-atomic/common/models';


@Component({
  selector: 'organisms-top-navigator',
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
