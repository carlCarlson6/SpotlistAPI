import { Id } from "./id";

export class Song {
    private constructor(
        private _id: Id, 
        private _artist: string,
        private _title: string,
    ) {}

    get id(): string {
        return this._id.toString();
    }

    get artist(): string {
        return this._artist;
    }

    get title(): string {
        return this._title;
    }

    static createNew(artist: string, title: string): Song {
        return new Song(Id.create(), artist, title);
    }
}