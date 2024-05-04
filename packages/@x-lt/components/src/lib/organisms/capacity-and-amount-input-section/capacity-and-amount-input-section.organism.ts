import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { TextInputFieldMolecule } from '@ng-atomic/components/molecules/text-input-field';

@Component({
  selector: 'organisms-capacity-and-amount-input-section',
  standalone: true,
  imports: [
    CommonModule,
    TextInputFieldMolecule,
  ],
  templateUrl: './capacity-and-amount-input-section.organism.html',
  styleUrls: ['./capacity-and-amount-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {class: 'organism section'},
})
export class CapacityAndAmountInputSectionOrganism implements OnInit {

  @Input()
  form = new UntypedFormGroup({
    amount: new UntypedFormControl({value: 3_000, disabled: true}, [Validators.required]),
    capacity: new UntypedFormControl({value: 1, disabled: true}, [Validators.required]),
  });

  constructor() { }

  ngOnInit(): void {
  }

}
