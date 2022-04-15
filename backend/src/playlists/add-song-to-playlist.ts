import { Playlist, PlayListId } from "./playlist";
import { DomainError } from "../common/domain-error";
import { fail, Result } from "typescript-monads";
import { StorePlaylist } from "./store-playlist";
import { GetPlaylistById } from "./get-playlist";
import { Song } from "./song";
import { promiseResultError } from "../common/promise-result-error";
import { PlaylistNotFound } from "./playlist-not-found";
import { SongDto } from "./api/models/song-dto";

export type AddSongToPlaylistCommand = { ListId: PlayListId, Song: SongDto }
export type AddSongToPlaylist = (command: AddSongToPlaylistCommand) => Promise<Result<Playlist, DomainError>>

export type AddSongToPlaylistDbAccess = { storePlaylist: StorePlaylist, getPlaylist: GetPlaylistById }

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
    