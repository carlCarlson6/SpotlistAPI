import { Id } from "../../src/common/id";

export const wrongUser = {
    id: Id.createNew(),
    name: "wrong userName",
    password: "wrong password"
};

export const userCarlKarlson = {
    id: Id.createNew(),
    name: "carlKarlson",
    password: "uS3rP@ssw0rd"
};

export const testUsers = [
    userCarlKarlson,
    wrongUser,
];