import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AddSongComponent } from './components/add-song/add-song.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { EditSongComponent } from './components/edit-song/edit-song.component';
import { NgModule } from '@angular/core';
import { SongListComponent } from './components/song-list/song-list.component';
import { SongsComponent } from './components/songs/songs.component';

@NgModule({
  declarations: [
    AppComponent,
    SongListComponent,
    SongsComponent,
    AddSongComponent,
    EditSongComponent,
  ],
  imports: [BrowserModule, AppRoutingModule, FormsModule, ReactiveFormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
