import { Song, SongType } from '../../models/song.model';

// We have fixed type of songs 1.pop, 2.rock 3.metal
export const songsCollection: Array<Song> = [
  {
    uri: 'song1',
    name: 'Song 1',
    type: SongType.Pop,
    singerList: ['A', 'B', 'C', 'D'],
  },
  {
    uri: 'song2',
    name: 'Song 2',
    type: SongType.Rock,
    singerList: ['B', 'Z', 'Q', 'T', 'Y', 'Z'],
  },
  {
    uri: 'song3',
    name: 'Song 3',
    type: SongType.Metal,
    singerList: ['A'],
  },
  {
    uri: 'song4',
    name: 'Song 5',
    type: SongType.Metal,
    singerList: ['A', 'B'],
  },
  {
    uri: 'song5',
    name: 'Lorem Ipsum is simply dummy that is high songs',
    type: SongType.Metal,
    singerList: ['A', 'B'],
  },
];
