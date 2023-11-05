import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { Router } from '@angular/router';
import { Song } from 'src/models/song.model';

@Component({
  selector: 'app-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SongListComponent {
  @Input()
  songLists: Array<Song> = [];

  @Output()
  onSongViewDetailClicked: EventEmitter<string> = new EventEmitter<string>();

  constructor(private router: Router) {}

  /**
   * Combines a list of singers into a formatted string.
   *
   * @param valueArray - Array of singer names
   * @returns A formatted string of combined singer names
   */
  combineSingerList(valueArray: Array<string>): string {
    const numberOfSingersToShow = 5; // Number of singers to show before using "and X others"
    const singers = [...valueArray]; // Clone the array to avoid modifying the original

    if (singers.length === 0) {
      return 'No Singers';
    }

    return this.formatSingers(singers, numberOfSingersToShow);
  }

  /**
   * Formats the list of singer names into a readable string.
   *
   * @param singers - Array of singer names
   * @param numberOfSingersToShow - Maximum number of singers to display before using "and X others"
   * @returns A formatted string of combined singer names
   */
  private formatSingers(
    singers: Array<string>,
    numberOfSingersToShow: number
  ): string {
    if (singers.length === 1) {
      return singers[0];
    }

    if (singers.length <= numberOfSingersToShow) {
      return (
        singers.slice(0, singers.length - 1).join(', ') +
        ' and ' +
        singers[singers.length - 1]
      );
    }

    const displayedSingers = singers.slice(0, numberOfSingersToShow);
    const othersCount = singers.length - numberOfSingersToShow;
    const othersString =
      othersCount === 1 ? '1 Other' : `${othersCount} Others`;

    return this.formatList(displayedSingers, ', ') + ' and ' + othersString;
  }

  /**
   * Formats a list of items into a string with the given separator.
   *
   * @param items - Array of items to format
   * @param separator - The separator to use between items
   * @returns A formatted string
   */
  private formatList(items: Array<string>, separator: string): string {
    return items.join(separator);
  }

  /**
   * Emit song id to parent
   *
   * @param song - Selected song
   */
  viewDetail(song: Song) {
    this.onSongViewDetailClicked.emit(song.uri);
  }

  /**
   * Open form with the prefilled data and allow to update the content
   */
  editSong(song: Song) {
    // Place your logic
    this.router.navigate(['/edit-song', song.uri]);
  }
}
