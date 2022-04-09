import { Song as DomainSong } from "../song";
import { Playlist } from "../playlist";

export interface Song {
    artist: string
    title: string
}

export type Songs = Song[]

export interface SongList {
    listId: string
    songs: Songs
}

export function FromDomainSong(song: DomainSong): Song {
    return {
        artist: song.artist,
        title: song.title
    };
}

export function FromPlaylist(playlist: Playlist): SongList {
    return {
        listId: playlist.id.toString(),
        songs: playlist.songs.map(FromDomainSong)
    }
}