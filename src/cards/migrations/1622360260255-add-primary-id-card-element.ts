import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPrimaryIdCardElement1622360260255
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "cardsElements" ADD COLUMN "id" uuid NOT NULL DEFAULT uuid_generate_v4()`
        );

        await queryRunner.query(
            `ALTER TABLE "cardsElements" ADD CONSTRAINT cards_element_pk  PRIMARY KEY (id);`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "cardsElements" DROP CONSTRAINT "cards_element_pk"`
        );

        await queryRunner.query(`ALTER TABLE "cardsElements" DROP COLUMN "id"`);
    }
}
