import { Container } from "inversify";

type addDependencies = (container: Container) => Container;

const buildInversionOfControlContainer = (): Container => {
    let container = new Container();
    return container;
}

export const container = buildInversionOfControlContainer();