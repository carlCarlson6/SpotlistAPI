import { Id } from "./id";
import { Song } from "./song";
import { AddSongToPlayList, Owner, PlayListId } from "./types";

export class Playlist {
    private constructor(
        readonly id: PlayListId,
        readonly owner: Owner,
        readonly songs: ReadonlyArray<Song>,
    ) {}

    get songList(): Song[] {
        return  this.songs.map(s => s);
    }

    static createNew(owner: Owner, songs: Song[]): Playlist {
        return new Playlist(Id.createNew(), owner, songs);
    }

    static create(id: Id, owner: Owner, songs: Song[]): Playlist {
        return new Playlist(id, owner, songs);
    }
}

export const addSongToPlayList: AddSongToPlayList = (playlist: Playlist) => 
    (song: Song) => Playlist.create(playlist.id, playlist.owner, [...playlist.songs, song])