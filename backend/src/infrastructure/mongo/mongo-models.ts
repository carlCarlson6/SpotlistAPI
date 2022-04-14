import { Playlist } from "../../playlists/playlist"
import { User } from "../../users/user"

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

export const PlaylistToDbModel = (playlist: Playlist) => ({
    id: playlist.id.toString(),
    owner: playlist.owner.toString(),
    songs: playlist.songs.map(song => ({
        id: song.id.toString(),
        title: song.title,
        artist: song.artist,
    })),
    createdAt: playlist.createdAt.getUTCDate()
});

export const DbModelToPlaylist = (playlistDbMode: PlaylistMongoModel) => {
    throw new Error("TOOD - not implemented");
}

export const UserToDbModel = (user: User) => ({
    id: user.id.toString(),
    name: user.name,
    hashedPassword: user.password.toString(),
    createdAt: user.createdAt.getUTCDate()
});

export const DbModelToUser = (user: UserMongoModel) => {
    throw new Error("TOOD - not implemented");
}