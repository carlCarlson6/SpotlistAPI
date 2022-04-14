import { IMaybe } from "typescript-monads";
import { Playlist, PlayListId } from "./playlist";

export type GetPlaylistById = (id: PlayListId) => Promise<IMaybe<Playlist>>

export const getPlaylistById: GetPlaylistById = (id: PlayListId) => {
    throw new Error("TOOD - not implemented");
}