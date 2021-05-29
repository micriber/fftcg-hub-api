import { MigrationInterface, QueryRunner } from 'typeorm';

export class createCardElementTable1622198552619 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "cardsElements" ("cardId" uuid NOT NULL, "element" character varying NOT NULL, CONSTRAINT fk_cards_elements FOREIGN KEY("cardId") REFERENCES cards(id));`
        );

        await queryRunner.query(`ALTER TABLE cards DROP COLUMN element;`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "cards_elements";`);
    }
}
