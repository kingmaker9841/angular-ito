import { Song, SongType } from 'src/models/song.model';
import { Subject, debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

import { Component } from '@angular/core';
import { DataApiService } from 'src/app/service/data-api.service';

@Component({
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.scss'],
})
export class SongsComponent {
  songLists: Array<Song> = [];
  searchText = '';

  selectedSong!: Song;
  private searchTerms = new Subject<string>();

  constructor(private dataApiService: DataApiService) {
    this.dataApiService.fetchSongs().subscribe((res) => {
      this.songLists = res;
    });

    this.searchTerms
      .pipe(
        debounceTime(300), // Adjust debounce time as needed
        distinctUntilChanged(),
        switchMap((term: string) => this.dataApiService.getSongsByName(term))
      )
      .subscribe((res) => {
        this.songLists = res;
      });
  }

  /**
   * Search songs based on the song name
   *
   * @param name - Name of the song
   */
  searchSongs(name: string) {
    this.searchTerms.next(name);
  }

  /**
   * Show song detail
   *
   * @param songId
   */
  showDetails(songId: string) {
    this.selectedSong = this.songLists.find(
      (song: Song) => song.uri === songId
    )!;
  }

  /**
   * Change the selected song into the metal
   */
  changeSongToMetal() {
    this.selectedSong.type = SongType.Metal;

    // FIXME Weird behavior, type get updated in the songs list but it is not reflected in the table
    this.songLists = [...this.songLists];
  }
}
