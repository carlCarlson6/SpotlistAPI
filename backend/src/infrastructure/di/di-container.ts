import { Container } from "inversify";

export type AddDependencies = (container: Container) => Container;

export const container = new Container();
