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
