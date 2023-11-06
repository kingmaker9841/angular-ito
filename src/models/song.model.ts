export enum SongType {
  Pop = 'pop',
  Rock = 'rock',
  Metal = 'metal',
}

export interface Song {
  uri: string;
  name: string;
  type: SongType;
  singerList: Array<string>;
}
