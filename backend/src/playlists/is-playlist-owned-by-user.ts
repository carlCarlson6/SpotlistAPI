import { ok, fail, Result } from "typescript-monads";
import { DomainError } from "../common/domain-error";
import { Id } from "../common/id";
import { Playlist } from "./playlist";
import { PlaylistNotFound } from "./playlist-not-found";

export const playlistNotFoundFail = () => fail<Playlist, DomainError>(new PlaylistNotFound());

export const isPlaylistOwnedByUser = (userId: Id): ((playlist: Playlist) => Result<Playlist, DomainError>) => 
    playlist => playlist.owner.toString() === userId.toString() 
        ? ok(playlist)
        : playlistNotFoundFail();