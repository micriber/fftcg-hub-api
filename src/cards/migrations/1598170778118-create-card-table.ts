import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCardTable1598170778118 implements MigrationInterface {
    name = 'createCardTable1598170778118';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "cards" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "element" character varying NOT NULL, "rarity" character varying NOT NULL, "cost" character varying NOT NULL, "power" character varying NOT NULL, "category1" character varying NOT NULL, "category2" character varying NOT NULL, "multicard" character varying NOT NULL, "exBurst" character varying NOT NULL, "name" character varying NOT NULL, "type" character varying NOT NULL, "job" character varying NOT NULL, "text" character varying NOT NULL, CONSTRAINT "PK_5f3269634705fdff4a9935860fc" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE UNIQUE INDEX "IDX_af8c1e25df58bc35de84c8e54e" ON "cards" ("code") `
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_af8c1e25df58bc35de84c8e54e"`);
        await queryRunner.query(`DROP TABLE "cards"`);
    }
}
