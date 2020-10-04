import { MigrationInterface, QueryRunner } from 'typeorm';

export class addSetOnCardTable1601804467629 implements MigrationInterface {
    name = 'addSetOnCardTable1601804467629';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "cards" ADD "set" character varying NOT NULL DEFAULT ''`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cards" DROP COLUMN "set"`);
    }
}
