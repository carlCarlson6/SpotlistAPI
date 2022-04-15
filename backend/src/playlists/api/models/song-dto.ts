import { Song } from "../../song";

export interface SongDto {
    artist: string
    title: string
}

export type SongsDtos = SongDto[]

export function FromDomainSong(song: Song): SongDto {
    return {
        artist: song.artist,
        title: song.title
    };
}