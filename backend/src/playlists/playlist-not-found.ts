import { DomainError } from "../common/domain-error";

export class PlaylistNotFound extends DomainError {
    get code(): number {
        return 404;
    }

    constructor() {
        super();
        this.name = "playlist not found";
        Object.setPrototypeOf(this, PlaylistNotFound.prototype);
    }
}
