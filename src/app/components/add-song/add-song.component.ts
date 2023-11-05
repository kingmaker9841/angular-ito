import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Song, SongType } from 'src/models/song.model';

import { DataApiService } from 'src/app/service/data-api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-song',
  templateUrl: './add-song.component.html',
  styleUrls: ['./add-song.component.scss'],
})
export class AddSongComponent implements OnInit, OnDestroy {
  songForm: FormGroup;
  submitted: boolean = false;
  songLists: Array<Song> = [];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private dataApiService: DataApiService
  ) {
    this.dataApiService.fetchSongs().subscribe((res) => {
      this.songLists = res;
    });
    this.songForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ],
      ],
      list: [
        '',
        [Validators.required, Validators.pattern(/^\s*\w+(\s*,\s*\w+)*\s*$/)],
      ],
      type: ['pop', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadSavedFormData();
  }

  ngOnDestroy(): void {
    this.saveFormIfEdited();
  }

  /**
   * Handles the form submission.
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.songForm.valid) {
      this.saveNewSong();
    }
  }

  /**
   * Checks if a form field is invalid.
   *
   * @param fieldName - The name of the field to check.
   * @returns True if the field is invalid, false otherwise.
   */
  isFieldInvalid(fieldName: string): boolean {
    const control = this.songForm.get(fieldName);
    return control && this.submitted
      ? control.invalid && (control.dirty || control.touched || this.submitted)
      : false;
  }

  @HostListener('window:beforeunload', ['$event'])
  /**
   * Handles the beforeunload event to save the form data if it was edited.
   *
   * @param $event - The beforeunload event.
   */
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: BeforeUnloadEvent): void {
    this.saveFormIfEdited();
  }

  /**
   * Loads previously saved form data from local storage.
   */
  private loadSavedFormData(): void {
    const savedFormData = localStorage.getItem('songFormData');
    if (savedFormData) {
      if (
        confirm('Do you want to prefill the form with previously unsaved data?')
      ) {
        this.songForm.setValue(JSON.parse(savedFormData));
      } else {
        localStorage.removeItem('songFormData');
      }
    }
  }

  /**
   * Saves the form data to local storage if it was edited.
   */
  private saveFormIfEdited(): void {
    if (this.isFormEdited()) {
      localStorage.setItem('songFormData', JSON.stringify(this.songForm.value));
    }
  }

  /**
   * Checks if the form was edited by the user.
   *
   * @returns True if the form was edited, false otherwise.
   */
  private isFormEdited(): boolean {
    const { name, list, type } = this.songForm.value;
    return !!name || !!list || (type !== null && type !== 'pop');
  }

  private parseFormData(formData: {
    name: string;
    list: string;
    type: SongType;
  }): Song {
    const singerList = formData.list
      .split(',')
      .map((item: string) => item.trim());

    return {
      uri: 'song' + (this.dataApiService.getSongCount() + 1),
      name: formData.name,
      type: formData.type,
      singerList: singerList,
    };
  }

  /**
   * Saves the new song to the collection and resets the form.
   */
  private saveNewSong(): void {
    const formData = this.songForm.value;
    const newSongData = this.parseFormData(formData);

    this.dataApiService.addSong(newSongData);

    this.resetForm();
    this.clearLocalStorage();
    this.navigateToHome();
  }

  private resetForm() {
    this.songForm.reset();
  }

  private clearLocalStorage() {
    localStorage.removeItem('songFormData');
  }

  private navigateToHome() {
    this.router.navigate(['/']);
  }
}
