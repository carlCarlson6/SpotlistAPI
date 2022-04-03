import { type } from "os";
import { Result } from "typescript-monads";
import { Id } from "./id";

export class Song {
    private constructor(
        readonly id: SongId,
        readonly artist: string,
        readonly title: string,
    ) {}

    static createNew(artist: string, title: string): Result<Song, Error[]> {
        const errors = []
        if (artist.length === 0)
            errors.push(new Error("empty artist name"));
        if (title.length === 0)
            errors.push(new Error("empty song title"));

        return errors.length !== 0 
            ? Result.ok(new Song(Id.createNew(), artist, title))
            : Result.fail(errors);
    }
}

type SongId = Id;