import { Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'textarea-input',
  imports: [],
  templateUrl: './textarea-input.component.html',
  styleUrl: './textarea-input.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => TextareaInputComponent),
      multi: true
    }
  ]
})
export class TextareaInputComponent {
  @Input() name = '';
  @Input() placeholder = '';

  value = '';
  disabled = false;

  private onChange = (val: any) => {};
  private onTouched = () => {};

  writeValue(val: any): void {
    this.value = val;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;

    target.style.height = 'auto';
    target.style.height = `${Math.min(target.scrollHeight, 400)}px`;
    
    this.value = target.value;
    this.onChange(this.value);
  }

  onBlur(): void {
    this.onTouched();
  }
}
