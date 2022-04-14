import { Playlist, PlayListId } from "./playlist";
import { Song as SongDto } from "./api/api-models";
import { DomainError } from "../common/domain-error";
import { fail, ok, result, Result } from "typescript-monads";
import { StorePlaylist } from "./store-playlist";
import { GetPlaylistById } from "./get-playlist";
import { Song } from "./song";
import { promiseResultError } from "../common/promise-result-error";

export type AddSongToPlaylistCommand = { ListId: PlayListId, Song: SongDto }
export type AddSongToPlaylist = (command: AddSongToPlaylistCommand) => Promise<Result<Playlist, DomainError>>

export type AddSongToPlaylistDbAccess = { storePlaylist: StorePlaylist, getPlaylist: GetPlaylistById }

class PlaylistNotFound extends DomainError {
    get code(): number {
        throw new Error("TODO - Method not implemented.");
    }
}

const addSong = (songDto: SongDto): ((playlist: Playlist) => Result<Playlist, DomainError>) => (playlist: Playlist) => 
    Song.createNew(songDto.artist, songDto.title).map(playlist.addSong);

export const addSongToPlaylist: (dbAccess: AddSongToPlaylistDbAccess) => AddSongToPlaylist = (dbAccess: AddSongToPlaylistDbAccess) => async (command: AddSongToPlaylistCommand) =>
    dbAccess.getPlaylist(command.ListId)
        .then(result => 
            result.match({
                some: addSong(command.Song),
                none: () => fail<Playlist, DomainError>(new PlaylistNotFound())
            })
        ).then(result => result.match({
            ok: dbAccess.storePlaylist,
            fail: error => promiseResultError<Playlist>(error)
        }));
    