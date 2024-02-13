import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, ViewChild, ViewChildren, } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators, } from '@angular/forms';
import { transition, trigger, useAnimation } from '@angular/animations';
import { v4 as uuidv4 } from 'uuid';
import { Subject, Subscription, of } from 'rxjs';
import { Router } from '@angular/router';
import * as validators from './pfds-form.validators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { transformSNIGroup, isValidIPv4, inverseTransformSNIGroup, isValidProtocol, isValidIPv6Address, isValidPort } from 'src/app/core/shared/utils';
import { ToastrService } from 'ngx-toastr';
import { enterAnimation, leaveAnimation } from 'src/app/core/shared/constants/animations';
import { FlowDescription, IPfdsForm, PfdAttribute, PfdFormValues } from 'src/app/core/interfaces/common.interface';

@Component({
  selector: 'app-pfds-form',
  templateUrl: './pfds-form.component.html',
  styleUrls: ['./pfds-form.component.scss'],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [useAnimation(enterAnimation)]),
      transition(':leave', [useAnimation(leaveAnimation)]),
    ]),
  ],
})
export class PfdsFormComponent implements OnInit, OnDestroy {
  @Input() isEditMode = false;
  @Input() appId: any;
  @Input() isChangeRequestFlow = false;
  @Input() isPfdCrSummary = false;
  @Input() isUpdateCRFlow = false;
  @Output() isDataFetchedFromApi = new EventEmitter<boolean>();
  // @ViewChild('pfdsLoader', { static: true }) pfdsLoader: LoaderComponent;
  @ViewChildren('flowDescViewPort')
  flowDescViewPort?: QueryList<CdkVirtualScrollViewport>;
  @Output() valueChange: EventEmitter<any> = new EventEmitter<any>();

  // pfdsForm: FormGroup = this.fb.group<IPfdsForm>({
  //   pfds: this.fb.array<PfdFormValues | null>([]),
  // });

  pfdsForm = new FormGroup({
    pfds: new FormArray<FormGroup<PfdFormValues | null>>([]),
  });
  savedFormValue: Array<any> = [];
  previewFormValues: PfdAttribute[] = [];
  randomId: string = '';
  // selectedDnProtocol: IDropdownItem = { id: null, label: '' };
  dnProtocols = [
    { id: 1, label: 'TLS_SNI' },
    { id: 2, label: 'TLS_SAN' },
    { id: 3, label: 'TLS_SCN' },
    { id: 4, label: 'DNS_QNAME' },
  ];
  closeIcon: string = '';
  formSubmitted = false;
  fetchedPfdCrAttributes: PfdAttribute[] = [];
  pfdCrAttributes: PfdAttribute[] = [];
  private validationDebounceSubject: Subject<void> = new Subject<void>();
  tooltipVisible = new Map<string, number>();
  tooltipClicked = new Map<string, number>();
  tooltipIcon: string = '';
  changedId: string = '';
  currentId: string = '';
  shouldSkipClosingTooltip = false;
  ngUnsubscribe$ = new Subject<void>();
  pfdFormArray = this.pfdsForm.controls['pfds'] as FormArray;
  getSpecificPfd = (pfdIndex: number): FormGroup => {
    // console.log('this.pfds().controls[pfdIndex] as FormGroup',this.pfds().controls[pfdIndex] as FormGroup)
    return this.pfds().controls[pfdIndex] as FormGroup;
  };

  getFlowDescriptionsControls(pfdIndex: number): FormArray {
    const specificPfd = this.getSpecificPfd(pfdIndex);

    // if (specificPfd && specificPfd.controls['flowDescriptions'] instanceof FormArray) {
    return specificPfd.controls['flowDescriptions'] as FormArray;
  }

  constructor(
    // protected nefService: NefService,
    private fb: FormBuilder,
    private router: Router,
    protected toasterService: ToastrService // private routerService: RouterService
  ) {}
  test(value: any) {
    console.log('pfd.geturs', value);
  }
  async ngOnInit(): Promise<void> {
    // this.pfdsLoader.show();
    // this.pfdsLoader.hide();
    if (!this.savedFormValue?.length && !this.isEditMode) {
      this.initalizeForm();
      this.addPfd();
    }

    this.pfds().controls.forEach((pfdGroup) => {
      pfdGroup.get('flowDescriptions')?.valueChanges.subscribe(() => {
        if (this.isEditMode) {
          this.checkIfChangesMade(pfdGroup);
        }
      });
    });

    this.subscribeToFormValuesToCheckValidity();
    this.subscribeToIdValidationSubject();
  }

  private checkIfChangesMade(pfdsGroup: AbstractControl) {
    if (this.isEditMode) {
      const result = this.transformChangedData(this.pfdsForm);
      pfdsGroup.get('isChanged')?.setValue(!result);
    }
  }

  private transformChangedData(formData: any): boolean {
    const newTransformedData = this.transformObjects(
      formData.getRawValue().pfds
    );

    return this.compareData(newTransformedData, this.previewFormValues);
  }

  updateIdValidation(): void {
    this.validationDebounceSubject.next();
  }

  subscribeToIdValidationSubject(): void {
    this.validationDebounceSubject
      .pipe(
        debounceTime(300),
        switchMap(() => {
          this.updateAllIdsValueAndValidity();
          return of(null);
        }),
        takeUntil(this.ngUnsubscribe$)
      )
      .subscribe();
  }

  closeAllTooltips() {
    if (!this.shouldSkipClosingTooltip) {
      for (const key in this.tooltipClicked) {
        // if (this.tooltipClicked[key] === true) {
        //   this.tooltipClicked[key] = false;
        //   this.tooltipVisible[key] = false;
        // }
      }
    }

    this.shouldSkipClosingTooltip = false;
  }

  setCorrectId(
    id: string,
    pfdIndex: number,
    flowDescriptionIndex: number,
    isClickDetection: boolean
  ): string {
    const correctId = id + pfdIndex + flowDescriptionIndex;
    if (isClickDetection) {
      this.currentId = correctId;
    }

    return correctId;
  }

  setId(event: any) {
    const srcElement = event.srcElement as HTMLElement;
    this.currentId = srcElement.id;
  }

  remainOpenTooltip(idString: string, index: number) {
    // const id = idString + index;
    // if (this.tooltipClicked[id]) {
    //   this.tooltipVisible[id] = true;
    //   this.shouldSkipClosingTooltip = true;
    // }
  }

  clickTooltip(idString: string, index: number) {
    // const id = idString + index;
    // for (const key in this.tooltipClicked) {
    //   if (key !== id) {
    //     this.tooltipClicked[key] = false;
    //     this.tooltipVisible[key] = false;
    //   }
    // }
    // if (this.tooltipVisible[id] && this.tooltipClicked[id]) {
    //   this.tooltipVisible[id] = false;
    //   this.tooltipClicked[id] = false;
    // } else {
    //   this.tooltipClicked[id] = !this.tooltipClicked[id];
    //   this.tooltipVisible[id] = true;
    // }
    // $event.stopPropagation();
  }

  compareData(formData: any, oldData: any[]): boolean {
    let foundMatch = false;
    for (const element of formData) {
      for (const oldElement of Object.values(oldData)) {
        if (element.id === oldElement?.id) {
          foundMatch = true;
          if (
            element?.flowDescriptions?.length !==
            oldElement?.flowDescriptions?.length
          ) {
            this.changedId = element.id;
            return false;
          } else {
            for (let i = 0; i <= element.flowDescriptions.length; i++) {
              if (
                element.flowDescriptions[i] !== oldElement.flowDescriptions[i]
              ) {
                this.changedId = element.id;
                return false;
              }
            }
          }
        }
      }
    }

    return foundMatch;
  }

  private generateRandomId() {
    const randomId = uuidv4();
    return randomId;
  }

  initalizeForm(): void {
    this.pfdsForm = this.fb.group({
      pfds: this.fb.array<FormGroup<PfdFormValues | null>>([]),
    });
  }

  pfds(): IPfdsForm {
    return this.pfdsForm.get('pfds') as IPfdsForm;
  }

  addPfd(pfdObject?: any, isOld?: boolean) {
    if (pfdObject || isOld) {
      this.pfds().push(this.newPfd(pfdObject, isOld));
    } else {
      this.pfds().insert(0, this.newPfd());
    }
    // this.pfds().controls = [...this.pfds().controls]
    this.changedId = '';
  }

  newPfd(pfdValues?: any, isOldPfd?: boolean): FormGroup<PfdFormValues> {
    const id = this.generateRandomId();
    return new FormGroup<PfdFormValues>({
      id: new FormControl<string>(pfdValues?.id || id, [
        Validators.required,
        validators.uniqueIdValidator(),
      ]),
      flowDescriptions: new FormArray<FormGroup<FlowDescription>>([]),
      isFlowDescriptionOpen: new FormControl<boolean>(true),
      isDomainNameOpen: new FormControl<boolean>(true),
      isUrlsOpen: new FormControl<boolean>(true),
      isNew: new FormControl<boolean>(!isOldPfd),
      isChanged: new FormControl<boolean>(!pfdValues),
    });
  }

  updateAllIdsValueAndValidity(): void {
    (this.pfds().controls as FormGroup[]).forEach((formGroup: FormGroup) => {
      formGroup.controls['id'].updateValueAndValidity();
    });
  }

  removePfd(empIndex: number) {
    if (this.pfds().length > 1) {
      this.pfds().removeAt(empIndex);
      this.pfds().controls = [...this.pfds().controls];
      // this.toasterService.showError('lbl-remove-pfd-alert');
      this.updateValidatyForLastTwoDuplicates();
    } else {
      // this.toasterService.showError('lbl-unable-to-remove-pfd-alert');
    }
  }

  pfdsFlowDescriptions(empIndex: number): FormArray<FormGroup<FlowDescription>> {
    return this.pfds().at(empIndex).get('flowDescriptions') as FormArray<FormGroup<FlowDescription>>;
  }

  newFlowDescription(flowDescriptions: any): FormGroup<FlowDescription> {
    return new FormGroup<FlowDescription>({
      isThisNestedFlowDescriptionOpen: new FormControl(true),
      // In Form initalization
      inIpProtocolDropdown: new FormControl(
        flowDescriptions?.inIpProtocolDropdown || '',
        [validators.idProtocolValidator]
      ),
      // OUT Form initalization
      outIpProtocolDropdown: new FormControl(
        flowDescriptions?.outIpProtocolDropdown || '',
        [validators.idProtocolValidator]
      ),

      // In Form initalization
      inFromIpDropDown: new FormControl(
        flowDescriptions?.inFromIpDropDown || '',
        [validators.iPAddressValidator]
      ),
      inFromPortDropdown: new FormControl(
        flowDescriptions?.inFromPortDropdown || '',
        [validators.portValidator]
      ),
      inToIpDropdown: new FormControl(flowDescriptions?.inToIpDropdown || '', [
        validators.iPAddressValidator,
      ]),
      inToPortDropdown: new FormControl(
        flowDescriptions?.inToPortDropdown || '',
        [validators.portValidator]
      ),

      // OUT Form initalization
      outFromIpDropdown: new FormControl(
        flowDescriptions?.outFromIpDropdown || '',
        [validators.iPAddressValidator]
      ),
      outFromPortDropdown: new FormControl(
        flowDescriptions?.outFromPortDropdown || '',
        [validators.portValidator]
      ),
      outToIpDropdown: new FormControl(
        flowDescriptions?.outToIpDropdown || '',
        [validators.iPAddressValidator]
      ),
      outToPortDropdown: new FormControl(
        flowDescriptions?.outToPortDropdown || '',
        [validators.portValidator]
      ),
    });
  }

  addFlowDescription(
    pfdIndex: number,
    flowDescription?: any,
    flowDescInsertIndex?: number
  ) {
    const flowDescriptionFormGroup = this.newFlowDescription(flowDescription);
    if (flowDescInsertIndex !== undefined) {
      this.pfdsFlowDescriptions(pfdIndex).insert(
        flowDescInsertIndex,
        flowDescriptionFormGroup
      );
    } else {
      this.pfdsFlowDescriptions(pfdIndex).push(flowDescriptionFormGroup);
    }
    this.toggleAccordionToDetectChanges(pfdIndex);

    console.log('addFlowDescription', this.pfdsForm);
    if (flowDescInsertIndex)
      this.scrollToAddedFlowDescription(pfdIndex, flowDescInsertIndex);
  }

  toggleAccordionToDetectChanges(pfdIndex: number) {
    this.pfds().at(pfdIndex).get('isFlowDescriptionOpen')?.setValue(false);
    setTimeout(() => {
      this.pfds().at(pfdIndex).get('isFlowDescriptionOpen')?.setValue(true);
    }, 0);
  }

  scrollToAddedFlowDescription(pfdIndex: number, flowDescInsertIndex: number) {
    setTimeout(() => {
      if (!this.flowDescViewPort?.length) {
        return;
      }

      const activeViewPort = this.flowDescViewPort.toArray()[pfdIndex];
      if (flowDescInsertIndex && activeViewPort) {
        activeViewPort.scrollToIndex(flowDescInsertIndex);
      }
    });
  }

  removeFlowDescription(pfdIndex: number, flowDescIndex: number) {
    this.pfdsFlowDescriptions(pfdIndex).removeAt(flowDescIndex);
    this.toggleAccordionToDetectChanges(pfdIndex);
  }

  addDomainNameFormControl(
    pfdFormGroup: any | FormGroup<PfdFormValues>,
    domainNamesValue?: string,
    dnProtocolValue?: any
  ) {
    pfdFormGroup.addControl(
      'domainNames',
      this.fb.control(domainNamesValue || '' || null, [
        validators.domainNamesValidator,
      ])
    );

    // this.selectedDnProtocol = nefConst.dnProtocols.find(
    //   (dnProtocol) => dnProtocol.label === dnProtocolValue?.label
    // );
    pfdFormGroup.addControl('dnProtocol', new FormControl(''));
  }

  addURLsFormControl(pfdFormGroup: any, urlsValue?: string) {
    pfdFormGroup.addControl(
      'urls',
      this.fb.control(urlsValue || '' || null, [validators.urlValidator])
    );
  }

  deleteDomainNamesFormControl(pfdFormGroup: any) {
    // restart isDomainNameOpen form controls state to true(used for keeping current state of toggle arrow icon)
    pfdFormGroup.controls['isDomainNameOpen'].patchValue(true);
    pfdFormGroup.removeControl('domainNames');
  }

  deleteUrlFormControl(pfdFormGroup: any) {
    // restart isUrlsOpen form controls state to true(used for keeping current state of toggle arrow icon)
    pfdFormGroup.controls['isUrlsOpen'].patchValue(true);
    pfdFormGroup.removeControl('urls');
  }

  prepopulateForm() {
    this.initalizeForm();
    if (!!this.savedFormValue.length) {
      this.savedFormValue.forEach((pfd: any, pfdIndex) => {
        // add isOld flag only for pfds which ids match with initialpfds
        // this way we know for sure they are old ones
        this.addPfd(pfd, this.isContainedInInitalPfdData(pfd));
        if (pfd?.domainNames) {
          this.addDomainNameFormControl(
            this.pfds().at(pfdIndex) as FormGroup,
            pfd?.domainNames,
            pfd?.dnProtocol
          );
        }

        if (pfd?.urls) {
          this.addURLsFormControl(
            this.pfds().at(pfdIndex) as FormGroup,
            pfd?.urls
          );
        }

        if (pfd?.flowDescriptions) {
          for (let j = 0; j < pfd.flowDescriptions.length; j++) {
            this.addFlowDescription(pfdIndex, pfd.flowDescriptions[j]);
          }
        }
      });
    }
  }

  toggleCollapseFlowDescription(pfdIndex: number) {
    const currentValue: boolean = (this.pfds().controls[pfdIndex] as FormGroup)
      .controls?.['isFlowDescriptionOpen'].value;
    (this.pfds().controls[pfdIndex] as FormGroup).controls?.[
      'isFlowDescriptionOpen'
    ].patchValue(!currentValue);
  }

  toggleCollapseDomainNames(pfdIndex: number) {
    const currentValue: boolean = (this.pfds().controls[pfdIndex] as FormGroup)
      .controls?.['isDomainNameOpen'].value;
    (this.pfds().controls[pfdIndex] as FormGroup).controls?.[
      'isDomainNameOpen'
    ].patchValue(!currentValue);
  }

  toggleCollapseUrls(pfdIndex: number) {
    const currentValue: boolean = (this.pfds().controls[pfdIndex] as FormGroup)
      .controls?.['isUrlsOpen'].value;
    (this.pfds().controls[pfdIndex] as FormGroup).controls?.[
      'isUrlsOpen'
    ].patchValue(!currentValue);
  }

  onSubmit(): boolean {
    this.formSubmitted = true;
    // this.valueChange.emit(
    //   this.pfdsForm.status === 'INVALID' && this.formSubmitted
    // );
    console.log('this.pfdsForm', this.pfdsForm);
    if (this.pfdsForm.valid) {
      this.preparePfdFormDataForRequest(this.pfdsForm);
      return true;
    } else {
      console.warn('FORM INVALID');
      return false;
    }
  }

  public subscribeToFormValuesToCheckValidity(): void {
    this.pfdsForm.valueChanges.subscribe((_) =>
      this.valueChange.emit(
        this.pfdsForm.status === 'INVALID' && this.formSubmitted
      )
    );
  }

  private isContainedInInitalPfdData(pfd: any): boolean {
    if (this.previewFormValues) {
      return this.previewFormValues[pfd?.id] != null;
    }
    return false;
  }

  private preparePfdFormDataForRequest(formData: any) {
    // we store form values in local storage, for next review step
    // this.storageService.set(
    //   'pfdData',
    //   this.transformObjects(formData.getRawValue().pfds)
    // );
  }
  private transformObjects(inputObjects: Array<any>): PfdAttribute[] {
    return inputObjects.map((inputObj) => ({
      id: inputObj.id,
      domainNames: inputObj.domainNames
        ? transformSNIGroup(inputObj.domainNames)
        : [''],
      flowDescriptions: inputObj.flowDescriptions
        .map((flow: any) => {
          const {
            inFromIpDropDown,
            inToIpDropdown,
            inFromPortDropdown,
            inToPortDropdown,
            inIpProtocolDropdown,
            outFromIpDropdown,
            outToIpDropdown,
            outFromPortDropdown,
            outToPortDropdown,
            outIpProtocolDropdown,
          } = flow;
          const inFlowDesc = `permit in ${inIpProtocolDropdown} from ${this.transformIpAdressValue(
            inFromIpDropDown
          )} ${inFromPortDropdown.replace(
            /\s/g,
            ''
          )} to ${this.transformIpAdressValue(
            inToIpDropdown
          )} ${inToPortDropdown.replace(/\s/g, '')}`;
          const outFlowDesc = `permit out ${outIpProtocolDropdown} from ${this.transformIpAdressValue(
            outFromIpDropdown
          )} ${outFromPortDropdown.replace(
            /\s/g,
            ''
          )} to ${this.transformIpAdressValue(
            outToIpDropdown
          )} ${outToPortDropdown.replace(/\s/g, '')}`;
          return [
            inFlowDesc.trim().replace(/ {2}/g, ' '),
            outFlowDesc.trim().replace(/ {2}/g, ' '),
          ]; // removes double space
        })
        .flat(),
      urls: (inputObj.urls ? inputObj.urls.split(',') : ['']).map((el: any) =>
        el.trim()
      ),
      dnProtocol: inputObj.dnProtocol?.label || '',
    }));
  }
  private hasSubnet(ipAddress: string): boolean {
    // Regular expression to match common subnet notation patterns (e.g., 192.168.1.1/24 or 2001:db8::1/64)
    const subnetPattern = /^(?:\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\/\d{1,2})$/;
    return subnetPattern.test(ipAddress);
  }

  private transformIpAdressValue(ipAddress: string): string {
    let transformedIpAddress = '';
    if (
      isValidIPv4(ipAddress) &&
      !this.hasSubnet(ipAddress) &&
      ipAddress !== 'any'
    ) {
      transformedIpAddress = `${ipAddress}/32`;
    } else {
      transformedIpAddress = ipAddress;
    }
    return transformedIpAddress;
  }

  private prepareDataForFormPrepopulation(
    pfds: PfdAttribute[]
  ): Array<any> | void {
    try {
      return pfds.map((inputObj: PfdAttribute) => ({
        id: inputObj?.id,
        domainNames:
          inputObj?.domainNames && inputObj?.domainNames?.length > 0
            ? inverseTransformSNIGroup(inputObj.domainNames)
            : undefined,
        flowDescriptions:
          inputObj?.flowDescriptions?.join(',') !== '' &&
          inputObj?.flowDescriptions?.join(',') !== undefined
            ? this.parseFlowDescriptionBlock(inputObj?.flowDescriptions)
            : undefined,
        urls:
          inputObj?.urls && inputObj?.urls?.length > 0
            ? inputObj.urls.join(',')
            : undefined,
        dnProtocol: { label: inputObj?.dnProtocol },
      }));
    } catch (e) {
      // this.handleDataPopulationError(e);
    }
  }

  private prepareLineArrayIndexes(lineArray: string[]) {
    let fromPortIndex = 5;
    let toIpAdressIndex = 7;
    let toPortIndex = 8;

    if (
      lineArray[fromPortIndex] === 'to' &&
      !lineArray[toPortIndex] &&
      !lineArray[toIpAdressIndex]
    ) {
      // case when both ports are missing
      fromPortIndex = -1;
      toIpAdressIndex = 6;
      toPortIndex = -1;
    } else {
      if (lineArray[fromPortIndex] === 'to') {
        // only first port is missing
        fromPortIndex = -1;
        toIpAdressIndex = 6;
        toPortIndex = 7;
      } else if (!lineArray[toPortIndex]) {
        // only second port is missing
        toPortIndex = -1;
      }
    }

    return {
      fromPortIndex,
      toIpAdressIndex,
      toPortIndex,
    };
  }

  private parseFlowDescriptionLine(flowDescriptionLine: string) {
    // Trim method removes leading and trailing spaces

    const lineArray = flowDescriptionLine
      .replace(/ {2}/g, ' ')
      .trim()
      .split(' ');
    const { fromPortIndex, toIpAdressIndex, toPortIndex } =
      this.prepareLineArrayIndexes(lineArray);

    return lineArray[1] === 'in'
      ? {
          inIpProtocolDropdown: isValidProtocol(lineArray[2]) && lineArray[2],

          inFromIpDropDown:
            (isValidIPv4(lineArray[4]) || isValidIPv6Address(lineArray[4])) &&
            lineArray[4],

          inFromPortDropdown:
            isValidPort(lineArray[fromPortIndex]) && lineArray[fromPortIndex],

          inToIpDropdown:
            (isValidIPv4(lineArray[toIpAdressIndex]) ||
              isValidIPv6Address(lineArray[toIpAdressIndex])) &&
            lineArray[toIpAdressIndex],

          inToPortDropdown:
            isValidPort(lineArray[toPortIndex]) && lineArray[toPortIndex],
        }
      : {
          outIpProtocolDropdown: isValidProtocol(lineArray[2]) && lineArray[2],

          outFromIpDropdown:
            (isValidIPv4(lineArray[4]) || isValidIPv6Address(lineArray[4])) &&
            lineArray[4],

          outFromPortDropdown:
            isValidPort(lineArray[fromPortIndex]) && lineArray[fromPortIndex],

          outToIpDropdown:
            (isValidIPv4(lineArray[toIpAdressIndex]) ||
              isValidIPv6Address(lineArray[toIpAdressIndex])) &&
            lineArray[toIpAdressIndex],

          outToPortDropdown:
            isValidPort(lineArray[toPortIndex]) && lineArray[toPortIndex],
        };
  }

  private getPermitType(flowDescriptionLine: string) {
    const lineArray = flowDescriptionLine.trim().split(' ');

    return lineArray[1];
  }

  private parseFlowDescriptionBlock(flowDescriptionBlock: Array<string>) {
    const parsedFlowDescriptions: any = [];

    try {
      for (let i = 0; i < flowDescriptionBlock.length; i++) {
        // if it's new tuple - add new object to existing object of the array

        if (this.getPermitType(flowDescriptionBlock[i]) === 'in') {
          parsedFlowDescriptions.push({
            ...this.parseFlowDescriptionLine(flowDescriptionBlock[i]),
          });
        } else {
          // if it's not a new tuple - permit type === 'out' - modify existing object to make in-out tuples

          parsedFlowDescriptions[parsedFlowDescriptions.length - 1] = {
            ...parsedFlowDescriptions[parsedFlowDescriptions.length - 1],
            ...this.parseFlowDescriptionLine(flowDescriptionBlock[i]),
          };
        }
      }
    } catch (e) {
      // this.handleDataPopulationError(e);
    }

    return parsedFlowDescriptions;
  }

  // private handleDataPopulationError(e: any) {
  //   this.toasterService.showError('pfd-data-population-err');
  //   setTimeout(() => {
  //     this.router.navigate(['/pfds']);
  //     this.routerService.resetPreviousRouterState();
  //   }, 5000);
  // }

  private updateValidatyForLastTwoDuplicates(): void {
    const newlyAddedFormGroups = (this.pfds().controls as FormGroup[]).filter(
      (formGroup: FormGroup) => formGroup.controls['isNew'].value
    );

    if (newlyAddedFormGroups.length === 1) {
      this.updateAllIdsValueAndValidity();
    }
  }

  calculateViewportHeight(group: AbstractControl): number {
    return group.get('isFlowDescriptionOpen')?.value &&
      (group.get('flowDescriptions') as FormArray).controls.length > 0
      ? 60
      : 0;
  }

  calculateItemHeight(): number {
    return this.isEditMode ? 820 : 550;
  }

  trackByFn(index: number): number {
    return index;
  }

  calculateMarginForPFDCard(group: any): number {
    const createPageHasErrors =
      group.status === 'INVALID' && this.formSubmitted && !this.isEditMode;
    const editPageHasErrors =
      group.status === 'INVALID' && this.formSubmitted && this.isEditMode;

    return createPageHasErrors ? 300 : editPageHasErrors ? 220 : 100;
  }

  ngOnDestroy(): void {
    // if (this.pfdReviewBtnClicked$) {
    //   this.pfdReviewBtnClicked$.unsubscribe();
    // }
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }
}
