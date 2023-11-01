import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { ActorActions } from '../../store/actor/actor.actions';
import { Actor } from 'src/app/core/interfaces/common.interface';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-add-actor-form',
  templateUrl: './add-actor-form.component.html',
  styleUrls: ['./add-actor-form.component.scss']
})
export class AddActorFormComponent {
  actorForm: FormGroup;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<AddActorFormComponent>, private store: Store) {
    this.actorForm = this.fb.group({
      name: [''],
      imageUrl: [''],
      yearOfBirth: [''],
      oscarsWon: [''],
      movies: this.fb.array([])
    });
  }
  // Convenience getter for easy access to form fields
  get f() { return this.actorForm.controls; }

  // Convenience getter for the movies form array
  movies(): FormArray {
    return this.actorForm.get('movies') as FormArray;
  }

  // Method to add a new movie field
  addMovie() {
    this.movies().push(this.fb.group({
      name: ['', Validators.required]
    }));
  }

  // Method to remove a movie field
  removeMovie(index: number) {
    this.movies().removeAt(index);
  }

  onSubmit() {
    console.log(this.actorForm.value);

    const newActor: Actor = {
      id: parseInt(this.generateUUID().split('-')[0], 16),
      name: this.actorForm.controls['name'].value ,
      imageUrl: this.actorForm.controls['imageUrl'].value,
      yearOfBirth: this.actorForm.controls['yearOfBirth'].value,
      oscarsWon: parseInt(this.actorForm.controls['oscarsWon'].value),
      movies: (this.actorForm.controls['movies'].value as Array<any>).map(movie => movie.name)
    };

    console.log('newActor', );
      this.store.dispatch(ActorActions.addActor({actor: newActor}));
    // Handle form submission logic
  }

  closeDialog() {
    this.dialogRef.close();
  }

  generateUUID() {
    return uuidv4();
  }
}
