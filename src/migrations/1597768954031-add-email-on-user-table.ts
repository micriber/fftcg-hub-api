import {MigrationInterface, QueryRunner} from "typeorm";

export class addEmailOnUserTable1597768954031 implements MigrationInterface {
    name = 'addEmailOnUserTable1597768954031'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
    }

}
