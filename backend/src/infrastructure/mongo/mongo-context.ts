import { Collection } from "mongodb";
import { Result } from "typescript-monads";
import { DbError } from "../../common/db-error";
import { DomainError } from "../../common/domain-error";
import { StorePlaylist } from "../../playlists/add-playlist";
import { Playlist } from "../../playlists/playlist";
import { User } from "../../users/api-models";

export interface PlaylistMongModel {
    id: string
    owner: string
    songs: {
        id: string
        title: string
        artist: string
    }[]
    createdAt: number
}

export interface MongoContext {
    users: Collection<User> // TODO create new model
    playlists: Collection<PlaylistMongModel>
}


export const storePlaylist: StorePlaylist = (context: MongoContext) => async (playlist: Playlist): Promise<Result<Playlist, DomainError>> => {
    const insertOneResult = await context.playlists.insertOne(toDbModel(playlist))
    if (!insertOneResult.acknowledged) {
        return Result.fail(new DbError("error while adding playlist"));
    }

    return Result.ok(playlist);
} 

function toDbModel(playlist: Playlist): PlaylistMongModel {
    return {
        id: playlist.id.toString(),
        owner: playlist.owner.toString(),
        songs: playlist.songs.map(song => ({
            id: song.id.toString(),
            title: song.title,
            artist: song.artist,
        })),
        createdAt: playlist.createdAt.getUTCDate()
    };
} 