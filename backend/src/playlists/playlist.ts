import { Id } from "../common/id";
import { Song } from "./song";

export type PlayListId = Id;
export type Owner = Id;

export class Playlist {
    private constructor(
        readonly id: PlayListId,
        readonly owner: Owner,
        readonly songs: ReadonlyArray<Song>,
        readonly createdAt: Date
    ) {}

    static createNew(owner: Owner, songs: Song[]): Playlist {
        return new Playlist(Id.createNew(), owner, songs, new Date());
    }

    static create(id: Id, owner: Owner, songs: Song[], createdAt: Date): Playlist {
        return new Playlist(id, owner, songs, createdAt);
    }

    addSong(song: Song): Playlist {
        return Playlist.create(this.id, this.owner, [...this.songs, song], this.createdAt);
    }
}

export type Playlists = ReadonlyArray<Playlist>;