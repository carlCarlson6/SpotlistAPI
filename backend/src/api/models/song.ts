import { Song as DomainSong } from "../../app/song";

export interface Song {
    artist: string
    title: string
}

export function fromDomainSong(song: DomainSong) {
    return {
        artist: song.artist,
        title: song.title
    };
}