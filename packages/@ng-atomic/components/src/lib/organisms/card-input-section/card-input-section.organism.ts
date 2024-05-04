import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TextInputFieldMolecule } from '@ng-atomic/components/molecules/text-input-field';

@Component({
  selector: 'organisms-card-input-section',
  standalone: true,
  imports: [
    CommonModule,
    TextInputFieldMolecule,
  ],
  templateUrl: './card-input-section.organism.html',
  styleUrls: ['./card-input-section.organism.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardInputSectionOrganism {

  @Input()
  control = new FormControl('');

  @Input()
  label = 'カード番号';

  @Input()
  placeholder = 'XXXX-XXXX-XXXX-XXXX';

}
