import { Collection } from "mongodb";
import { Id } from "../../common/id";
import { Playlist } from "./playlist";
import { Song } from "./song";

export type PlayListId = Id;
export type Owner = Id;
export type SongId = Id;

export type AddSongToPlayList = (playlist: Playlist) => AddSong;
export type AddSong = (song: Song) => Playlist;

export type RetrievePlaylist = (id: PlayListId) => Playlist;
export type RetrieveOwnerPlaylists = (id: Owner) => ReadonlyArray<Playlist>;

export type BuildRetrievePlaylist = (playlists: Collection<Playlist>) => RetrievePlaylist
export type BuildRetrieveOwnerPlaylists = (playlists: Collection<Playlist>) => RetrieveOwnerPlaylists;