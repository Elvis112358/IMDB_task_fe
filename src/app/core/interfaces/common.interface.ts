import { Form, FormArray, FormControl, FormGroup } from "@angular/forms";

export class User {
  name: string;
  surname: string;
  department: string;
  age: number;
  salary: number;
  position: string;
  startDate: Date;
  toDate: Date;

  constructor(
    name: string = '',
    surname: string = '',
    department: string = 'dev',
    age: number = 18,
    salary: number = 500,
    position: string = 'junior',
    startDate = new Date(),
    toDate = new Date()
  ) {
    this.name = name;
    this.surname = surname;
    this.department = department;
    this.age = age;
    this.salary = salary;
    this.position = position;
    this.startDate = startDate;
    this.toDate = toDate;
  }
}

export interface Movie {
  name: string;
  year: string;
  creators: string;
  imageLink: string;
  rating: number;
  genre: string;
  description: string;
}

export interface CounterState {
  count: number;
}

export interface AppState {
  counter: CounterState;
}
export interface Actor {
  id: number;
  name: string;
  imageUrl: string;
  yearOfBirth: number;
  oscarsWon: number;
  movies: string[];
}

export interface Banner {
    active: boolean;
    buttonText: string;
    id: string;
    scope: string;
    scopeId: string;
    subtitle?: string | undefined;
    title: string;
    type: string;
    url: string;
    validFrom: Date;
    validTo: Date;
    version: number;
    image: string;
}



export interface FlowDescription {
  isThisNestedFlowDescriptionOpen: FormControl<boolean | null>,
  // In Form initalization
  inIpProtocolDropdown: FormControl<string>
  // OUT Form initalization
  outIpProtocolDropdown: FormControl<string>

  // In Form initalization
  inFromIpDropDown: FormControl<string>
  inFromPortDropdown: FormControl<string>
  inToIpDropdown: FormControl<string>
  inToPortDropdown: FormControl<string>

  // OUT Form initalization
  outFromIpDropdown: FormControl<string>
  outFromPortDropdown: FormControl<string>
  outToIpDropdown: FormControl<string>,
  outToPortDropdown: FormControl<string>,
}
export interface PfdFormValues {
  id: FormControl<string | null>;
  urls?: FormControl<string>;
  domainNames?: FormControl<string | null>;
  dnProtocol?: FormControl<string | null>;
  flowDescriptions?: FormArray<FormGroup<FlowDescription>>;
  isFlowDescriptionOpen?: FormControl<boolean | null>,
  isDomainNameOpen?: FormControl<boolean | null>,
  isUrlsOpen?: FormControl<boolean | null>,
  isNew?: FormControl<boolean | null>,
  isChanged?: FormControl<boolean | null>,
}
export interface IPfdsForm extends FormArray{
  pfds: FormArray<FormGroup<PfdFormValues | null>>
}








export interface IPfdAttribute {
  id?: string;
  /** Attribute name */
  name?: string;
  /** array if domain names string */
  domainNames?: Array<string>;
  /** array if flow description string */
  flowDescriptions?: Array<string>;
  /** array if url string */
  urls?: Array<string>;
  /** Description of the attribute if required */
  description?: string;
  /** Dn protocol */
  dnProtocol?: string;
  isRemoved?: boolean;
  changed?: number;
  removed?: number;
  isNewCreatedPfd?: boolean;
  uniqueId?: string;
}

export declare class PfdAttribute implements IPfdAttribute {
  id?: string;
  name?: string;
  domainNames?: Array<string>;
  flowDescriptions?: Array<string>;
  urls?: Array<string>;
  description?: string;
  dnProtocol?: string;
  isRemoved?: boolean;
  changed?: number;
  removed?: number;
  isNewCreatedPfd?: boolean;
  uniqueId?: string;
  constructor(pfd: IPfdAttribute);
}
