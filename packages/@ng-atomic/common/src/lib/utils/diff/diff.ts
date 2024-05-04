import { SelectionModel } from "@angular/cdk/collections";

export function diff<T = any>(initial: SelectionModel<T>, current: SelectionModel<T>): {
  selectedIds: T[],
  unselectedIds: T[],
} {
  return {
    selectedIds: current.selected.filter((id: T) => !initial.isSelected(id)),
    unselectedIds: initial.selected.filter((id: T) => !current.isSelected(id)),
  }
}
