import { IMaybe, none, some } from "typescript-monads";
import { getContext } from "../infrastructure/mongo/mongo-context";
import { dbModelToPlaylist } from "../infrastructure/mongo/mongo-models";
import { Owner, Playlist, PlayListId, Playlists } from "./playlist";

export type GetPlaylistById = (id: PlayListId) => Promise<IMaybe<Playlist>>
export type GetUserPlaylists = (id: Owner) => Promise<Playlists>
export type GetPlaylistQuery = { Owner: Owner, PlaylistId: PlayListId };

export const getPlaylistById: GetPlaylistById = (id: PlayListId) =>
    getContext()
        .then(context => 
            context.playlists.findOne({ id }))
        .then(playlistDbModel => 
            !playlistDbModel 
                ? none() 
                : some(dbModelToPlaylist(playlistDbModel)));

export const getUserPlaylists: GetUserPlaylists = (id: Owner) =>
    getContext()
        .then(context =>
            context.playlists.find({owner: id.toString()}).toArray()
        .then(playlists => 
            playlists.map(dbModelToPlaylist)));