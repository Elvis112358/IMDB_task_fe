import { ValidatorFn, AbstractControl, ValidationErrors, FormGroup, FormArray } from '@angular/forms';
import { isValidIPv6Address, isValidIPv4, isValidPort, isValidProtocol, isValidUrlGroup, isValidSNIsGroup } from 'src/app/core/shared/utils';


export function uniqueIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // Access the parent form group
    const parentFormGroup: FormGroup | null = control.parent as FormGroup;

    if (parentFormGroup) {
      // Access formArray and it's values
      const grandparentFormGroup: FormArray | null =
        parentFormGroup.parent as FormArray;

      if (grandparentFormGroup) {
        const numberOfSameValues = countSameValues(control, grandparentFormGroup);
        if (numberOfSameValues > 1) {
          return { idValueInvalid: true };
        }
      }
    }
    return null;
  };
}

export function iPAddressValidator(control: AbstractControl): ValidationErrors | null {
  const isValid =
    isValidIPv6Address(control.value) || isValidIPv4(control.value);
  return isValid ? null : { ipValueInvalid: true };
}

export function portValidator(control: AbstractControl): ValidationErrors | null {
  const isValid = isValidPort(control.value);
  return isValid ? null : { portValueInvalid: true };
}

export function idProtocolValidator(control: AbstractControl): ValidationErrors | null {
  const isValid = isValidProtocol(control.value);
  return isValid ? null : { idProtocolValueInvalid: true };
}

export function urlValidator(control: AbstractControl): ValidationErrors | null {
  const isValid = isValidUrlGroup(control.value);
  return isValid ? null : { urlsValueInvalid: true };
}

export function domainNamesValidator(control: AbstractControl): ValidationErrors | null {
  const isValid = isValidSNIsGroup(control.value);
  return isValid ? null : { domainNameValueInvalid: true };
}

function countSameValues(control: AbstractControl, grandparentFormGroup: FormArray): number {
  let numberOfSameValues = 0;
        // grandparentFormGroup.controls.forEach((formGroup: FormGroup) => {
        //   if (compareStringsCaseInsensitive(control.value, formGroup.controls?.id?.value)) {
        //     numberOfSameValues++;
        //   }
        // });
  return numberOfSameValues;
}

function compareStringsCaseInsensitive(str1: string, str2: string): boolean {
  return str1.toLowerCase() === str2.toLowerCase();
}
