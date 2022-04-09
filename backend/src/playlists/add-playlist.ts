import { Result } from "typescript-monads";
import { Owner, Playlist } from "./playlist";
import { Songs as SongsDtos } from "./api/api-models";
import { container } from "../infrastructure/di/di-container";
import { DiTypes } from "../infrastructure/di/di-types";
import { MongoContext, storePlaylist } from "../infrastructure/mongo/mongo-context";
import { Songs } from "./song";
import { DomainError } from "../common/domain-error";
import { promiseResultError } from "../common/promise-result-error";

export type AddListToUserCommand = {
    Owner: Owner,
    Songs: SongsDtos
}
export type AddPlaylistToUser = (command: AddListToUserCommand) => Promise<Result<Playlist, DomainError>>;
export type StorePlaylist = (context: MongoContext) => (plalist: Playlist) => Promise<Result<Playlist, DomainError>>

const createSongs = (dtos: SongsDtos): Result<Songs, DomainError> => {
    throw new Error("TODO - not implemented");
}
const createPlaylist = (owner: Owner) => (songs: Songs) => Playlist.createNew(owner, songs);

class AddPlaylistToUserService {
    constructor(
        private readonly context: MongoContext,
    ) { }

    execute(command: AddListToUserCommand): Promise<Result<Playlist, DomainError>> {
        return createSongs(command.Songs)
            .map(createPlaylist(command.Owner))
            .match({
                ok: storePlaylist(this.context),
                fail: error => promiseResultError<Playlist>(error)
            });
    }
}

export const addPlaylistToUser: AddPlaylistToUser = container.get<AddPlaylistToUserService>(DiTypes.AddListToUser).execute