import {MigrationInterface, QueryRunner} from "typeorm";

export class userNameFamilyNameOptional1622303089647 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "firstName" DROP NOT NULL`
        );

        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "lastName" DROP NOT NULL`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
