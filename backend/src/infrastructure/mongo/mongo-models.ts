import { Id } from "../../common/id"
import { Playlist } from "../../playlists/playlist"
import { Song } from "../../playlists/song"
import { User } from "../../auth/user"

export interface PlaylistMongoModel {
    id: string
    owner: string
    songs: {
        id: string
        title: string
        artist: string
    }[]
    createdAt: number
}

export interface UserMongoModel {
    id: string
    name: string
    hashedPassword: string
    createdAt: number
}

export const playlistToDbModel = (playlist: Playlist) => ({
    id: playlist.id.toString(),
    owner: playlist.owner.toString(),
    songs: playlist.songs.map(song => ({
        id: song.id.toString(),
        title: song.title,
        artist: song.artist,
    })),
    createdAt: playlist.createdAt.valueOf()
});

export const dbModelToPlaylist = (dbModel: PlaylistMongoModel) => {
    return Playlist.create(
        Id.create(dbModel.id),
        Id.create(dbModel.owner),
        dbModel.songs.map(dbSong => Song.create(Id.create(dbSong.id), dbSong.artist, dbSong.title)),
        millisecondsToDate(dbModel.createdAt)
    );
}

const millisecondsToDate = (millisenconds: number) => new Date(millisenconds*1000);

export const userToDbModel = (user: User) => ({
    id: user.id.toString(),
    name: user.name,
    hashedPassword: user.password.toString(),
    createdAt: user.createdAt.getUTCDate()
});

export const dbModelToUser = (user: UserMongoModel) => {
    throw new Error("TODO - not implemented");
}