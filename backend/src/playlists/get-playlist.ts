import { IMaybe } from "typescript-monads";
import { Playlist, PlayListId } from "./playlist";

export type GetPlaylist = (id: PlayListId) => Promise<IMaybe<Playlist>>

export const getPlaylist: GetPlaylist = (id: PlayListId) => {
    throw new Error("TOOD - not implemented");
}