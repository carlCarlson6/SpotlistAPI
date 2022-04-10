import { Result } from "typescript-monads";
import { DomainError } from "../common/domain-error";
import { Id } from "../common/id";

export type SongId = Id;

export class Song {
    private constructor(
        readonly id: SongId,
        readonly artist: string,
        readonly title: string,
    ) {}

    static createNew(artist: string, title: string): Result<Song, DomainError> {
        const errors = []
        if (artist.length === 0)
            errors.push("empty artist name");
        if (title.length === 0)
            errors.push("empty song title");

        return errors.length !== 0 
            ? Result.ok(new Song(Id.createNew(), artist, title))
            : Result.fail(new InvalidSongInputError(errors.join(", ")));
    }
}

export type Songs = Song[];

class InvalidSongInputError extends DomainError {
    get code(): number {
        return 400;
    }

    constructor(message: string) {
        super(message);
        this.name = "invalid song input"
        Object.setPrototypeOf(this, InvalidSongInputError.prototype);
    }
}