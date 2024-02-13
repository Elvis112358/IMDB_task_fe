import { Component, EventEmitter, Input, Output, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-toggle-switch',
  templateUrl: './toggle-switch.component.html',
  styleUrls: ['./toggle-switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ToggleSwitchComponent),
      multi: true,
    },
  ],
})
export class ToggleSwitchComponent implements ControlValueAccessor {
  @Input() label: any;
  @Input() public disabled: boolean;
  @Input() showSpinner = false;
  @Input() assignThenDisable: boolean = false;
  // activate tooltip option when hovering on label
  @Input() showTooltip = false;
  @Input()
  @Output()
  valueChanged = new EventEmitter<any>();

  public set value(isChecked: boolean) {
    if (!this.disabled) {
      this.isChecked = isChecked;
      this.onChange(isChecked);
    }
    if (this.assignThenDisable) {
      this.isChecked = isChecked;
      this.onChange(isChecked);
    }
  }

  public isChecked: boolean = false;

  constructor() {
    this.disabled = false;
  }

  public onChange: any = () => {};
  public onTouch: any = () => {};

  public writeValue(value: any): void {
    this.value = value;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  public openTooltip(tooltip:any, spanElement: any): void {
    tooltip.close();
    if (this.isEllipsisActive(spanElement) && this.showTooltip) {
      tooltip.open();
    }
  }
  public closeTooltip(tooltip:any): void {
    tooltip.close();
  }

  public isEllipsisActive(e:any): boolean {
    return e.offsetWidth < e.scrollWidth;
  }

  public registerOnTouched(fn: any): void {}

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public toggleChecked(): void {
    if (!this.disabled && !this.showSpinner) {
      this.isChecked = !this.isChecked;
      this.valueChanged.emit(this.isChecked);
      this.onChange(this.isChecked);
    }
  }

}
