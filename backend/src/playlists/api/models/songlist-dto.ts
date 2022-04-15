import { Playlist } from "../../playlist";
import { FromDomainSong, SongsDtos } from "./song-dto";

export interface SongListDto {
    listId: string
    songs: SongsDtos
}

export function FromPlaylist(playlist: Playlist): SongListDto {
    return {
        listId: playlist.id.toString(),
        songs: playlist.songs.map(FromDomainSong)
    }
}