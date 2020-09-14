import * as path from 'path';
import {
    Builder,
    fixturesIterator,
    Loader,
    Parser,
    Resolver,
} from 'typeorm-fixtures-cli/dist';
import { getRepository } from 'typeorm';
import { createConnection } from 'typeorm/index';

export default async (): Promise<void> => {
    let connection;

    try {
        connection = await createConnection('test');
        await connection.dropDatabase();
        await connection.runMigrations();

        const loader = new Loader();
        loader.load(path.resolve('./fixtures'));

        const resolver = new Resolver();
        const fixtures = resolver.resolve(loader.fixtureConfigs);
        const builder = new Builder(connection, new Parser());

        for (const fixture of fixturesIterator(fixtures)) {
            const entity = await builder.build(fixture);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
            await getRepository(entity.constructor.name).save(entity);
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error(err.message);
        }
    } finally {
        if (connection) {
            await connection.close();
        }
    }
};
