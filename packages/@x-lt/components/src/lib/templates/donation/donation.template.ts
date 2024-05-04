import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Action } from '@ng-atomic/common/models';

enum ActionId {
  BACK = 'back',
  NEXT = 'next',
  SUBMIT = 'submit',
}

const ACTIONS_1: Action[] = [
  { id: ActionId.NEXT, name: '次へ' },
];

const ACTIONS_2: Action[] = [
  { id: ActionId.BACK, name: '戻る' },
  { id: ActionId.NEXT, name: '次へ' },
];

const ACTIONS_3: Action[] = [
  { id: ActionId.SUBMIT, name: '寄付して奨学金を作る' },
];

@Component({
  selector: 'templates-donation',
  templateUrl: './donation.template.html',
  styleUrls: ['./donation.template.scss']
})
export class DonationTemplate implements OnInit {
  ACTIONS_1 = ACTIONS_1;
  ACTIONS_2 = ACTIONS_2;
  ACTIONS_3 = ACTIONS_3;

  @Input()
  form = new UntypedFormGroup({
    userInfo: new UntypedFormGroup({
      fullName: new UntypedFormControl(''),
      address: new UntypedFormControl(''),
    }),
    donation: new UntypedFormGroup({
      // name: new FormControl(''),
      amount: new UntypedFormControl({value: 3_000, disabled: true}, [Validators.required]),
      capacity: new UntypedFormControl({value: 1, disabled: true}, [Validators.required]),
    }),
    card: new UntypedFormGroup({
      number: new UntypedFormControl(''),
      expMonth: new UntypedFormControl(null),
      expYear: new UntypedFormControl(null),
      cvc: new UntypedFormControl(''),
    }),
    tweet: new UntypedFormControl(''),
  });

  @Input()
  menuActions: Action[] = [];
  
  actions: Action[] = [

  ];

  @Input()
  title = '';

  @Output()
  action = new EventEmitter<Action>();

  @Output()
  backButtonClick = new EventEmitter<void>();

  constructor() { }

  ngOnInit(): void {
  }

}
