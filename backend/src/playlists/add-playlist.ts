import { Result } from "typescript-monads";
import { Owner, Playlist } from "./playlist";
import { Songs as SongsDtos } from "./api/api-models";
import { Song, Songs } from "./song";
import { DomainError } from "../common/domain-error";
import { promiseResultError } from "../common/promise-result-error";
import { StorePlaylist } from "./store-playlist";

export type AddListToUserCommand = { Owner: Owner, Songs: SongsDtos }
export type AddPlaylistToUser = (command: AddListToUserCommand) => Promise<Result<Playlist, DomainError>>

const createSongs = (dtos: SongsDtos) => 
    dtos.map(dto => Song.createNew(dto.artist, dto.title))
        .map(result => result.map(song => [song]))
        .reduce((prev, current) => prev.match({
            ok: prevSongs => current.match({
                ok: currentSongs => Result.ok(prevSongs.concat(currentSongs)),
                fail: currentError => Result.fail(currentError)
            }),
            fail: prevError => Result.fail(prevError)
        }));

const createPlaylist = (owner: Owner) => (songs: Songs) => Playlist.createNew(owner, songs);

export const addPlaylistToUser: (storePlaylist: StorePlaylist) => AddPlaylistToUser = (storePlaylist: StorePlaylist) => (command: AddListToUserCommand) =>
    createSongs(command.Songs)
    .map(createPlaylist(command.Owner))
    .match({
        ok: storePlaylist,
        fail: error => promiseResultError<Playlist>(error)
    });
