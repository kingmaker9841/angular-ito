import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  ComponentFixture,
  TestBed,
  async,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { Song, SongType } from '../../../models/song.model';

import { DataApiService } from 'src/app/service/data-api.service';
import { FormsModule } from '@angular/forms';
import { SongListComponent } from '../song-list/song-list.component';
import { SongsComponent } from './songs.component';
import { of } from 'rxjs';
import { songsCollection } from 'src/app/mockData/songs';

describe('SongsComponent', () => {
  let component: SongsComponent;
  let fixture: ComponentFixture<SongsComponent>;
  let dataApiService: DataApiService;

  const mockSongs: Song[] = [...songsCollection];

  beforeEach(async () => {
    const activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [
      'snapshot',
    ]);
    activatedRouteSpy.snapshot = { paramMap: { get: () => 'song1' } };

    TestBed.configureTestingModule({
      declarations: [SongsComponent, SongListComponent],
      imports: [FormsModule, RouterModule],
      providers: [
        DataApiService,
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SongsComponent);
    component = fixture.componentInstance;
    dataApiService = TestBed.inject(DataApiService);

    spyOn(dataApiService, 'fetchSongs').and.returnValue(of(mockSongs));
    spyOn(dataApiService, 'getSongsByName').and.callFake((term: string) => {
      if (term === 'test') {
        return of(mockSongs);
      } else {
        return of([]);
      }
    });
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch songs on initialization', fakeAsync(() => {
    fixture.detectChanges();

    expect(component.songLists).toEqual(mockSongs);
  }));

  it('should search for songs when search text changes', fakeAsync(() => {
    component.searchSongs('test');
    tick(300);

    expect(dataApiService.getSongsByName).toHaveBeenCalledWith('test');
    expect(component.songLists).toEqual(mockSongs);
  }));

  it('should show song details when a song is selected', () => {
    const songId = 'song1';

    fixture.detectChanges();

    component.showDetails(songId);

    expect(component.selectedSong).toEqual(mockSongs[0]);
  });

  it('should change song type to Metal', () => {
    component.selectedSong = mockSongs[0];

    component.changeSongToMetal();

    expect(component.selectedSong.type).toEqual(SongType.Metal);
  });
});
