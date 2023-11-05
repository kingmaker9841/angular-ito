import { ActivatedRoute, Route, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Song, SongType } from 'src/models/song.model';

import { DataApiService } from 'src/app/service/data-api.service';

@Component({
  selector: 'app-edit-song',
  templateUrl: './edit-song.component.html',
  styleUrls: ['./edit-song.component.scss'],
})
export class EditSongComponent implements OnInit {
  songForm!: FormGroup;
  songData!: Song;
  songId!: string;
  submitted: boolean = false;
  songLists: Array<Song> = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
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
    this.songId = this.route.snapshot.paramMap.get('id')!;
    this.songData = this.songLists.find((song) => song.uri === this.songId)!;
    this.songForm.setValue({
      name: this.songData.name,
      list: this.songData.singerList.join(', '),
      type: this.songData.type,
    });
  }

  /**
   * Handle form submission
   */
  onSubmit(): void {
    this.submitted = true;
    if (this.songForm.valid) {
      const formData = this.songForm.value;
      const updatedSong = this.prepareUpdatedSong(formData);
      this.updateSong(updatedSong);
      this.resetFormAndNavigate();
    }
  }

  private prepareUpdatedSong(formData: {
    name: string;
    list: string;
    type: SongType;
  }): Song {
    return {
      uri: this.songId,
      name: formData.name,
      type: formData.type,
      singerList: formData.list.split(',').map((item: string) => item.trim()),
    };
  }

  /**
   * Update a song in the collection
   *
   * @param updatedSong - Updated song data
   */
  private updateSong(updatedSong: Song): void {
    this.dataApiService.updateSong(updatedSong, this.songId);
  }

  /**
   * Reset the form and navigate back
   */
  private resetFormAndNavigate(): void {
    this.resetForm();
    this.router.navigate(['/']);
  }

  private resetForm(): void {
    this.songForm.reset();
  }

  /**
   * Check if a form field is invalid
   *
   * @param fieldName - Name of the form field
   * @returns True if the field is invalid, false otherwise
   */
  isFieldInvalid(fieldName: string): boolean {
    const control = this.songForm.get(fieldName);
    return control && this.submitted
      ? control.invalid && (control.dirty || control.touched || this.submitted)
      : false;
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
