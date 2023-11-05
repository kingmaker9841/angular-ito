import { Observable, of } from 'rxjs';

import { Injectable } from '@angular/core';
import { Song } from 'src/models/song.model';
import { songsCollection } from '../mockData/songs';

@Injectable({
  providedIn: 'root',
})
export class DataApiService {
  // Cache the songs list
  private allSongs = songsCollection;

  constructor() {}

  /**
   * Get list of songs
   *
   * @returns
   */
  public fetchSongs(): Observable<Array<Song>> {
    return of(this.allSongs);
  }

  /**
   * Get list of the songs based on song name
   *
   * @param songName
   * @returns
   */
  public getSongsByName(songName: string) {
    const songs = this.allSongs.filter((song) =>
      song.name.toLowerCase().includes(songName.toLowerCase())
    );
    return of(songs);
  }

  public addSong(newSong: Song): void {
    this.allSongs.push(newSong);
  }

  public updateSong(updatedSong: Song, songId: string) {
    const updatedSongIndex = this.allSongs.findIndex(
      (song) => song.uri === songId
    );
    this.allSongs[updatedSongIndex] = updatedSong;
  }

  public getSongCount() {
    return this.allSongs.length;
  }
}
