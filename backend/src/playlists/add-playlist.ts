import { Result } from "typescript-monads";
import { Owner, Playlist } from "./playlist";
import { Songs as SongsDtos } from "./api/api-models";
import { mongoStorePlaylist } from "../infrastructure/mongo/mongo-context";
import { Song, Songs } from "./song";
import { DomainError } from "../common/domain-error";
import { promiseResultError } from "../common/promise-result-error";
import { getContext } from "../infrastructure/mongo/mongo-connection";

export type AddListToUserCommand = {
    Owner: Owner,
    Songs: SongsDtos
}
export type AddPlaylistToUser = (command: AddListToUserCommand) => Promise<Result<Playlist, DomainError>>
export type StorePlaylist = (plalist: Playlist) => Promise<Result<Playlist, DomainError>>

const createSongs = (dtos: SongsDtos): Result<Songs, DomainError> => 
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

export const addPlaylistToUser: AddPlaylistToUser = (command: AddListToUserCommand) => 
    createSongs(command.Songs)
        .map(createPlaylist(command.Owner))
        .match({
            ok: mongoStorePlaylist(getContext()),
            fail: error => promiseResultError<Playlist>(error)
        });
