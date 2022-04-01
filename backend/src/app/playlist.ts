import { Id } from "./id";
import { Song } from "./song";

export class PlayList {
    private constructor(
        private _id: Id,
        private _songs: Song[],
    ) {}

    get id(): string {
        return this._id.toString();
    }

    get songs(): Song[] {
        return [...this._songs];
    }

    
}