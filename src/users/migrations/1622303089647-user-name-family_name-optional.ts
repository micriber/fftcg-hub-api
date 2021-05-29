import { MigrationInterface, QueryRunner } from 'typeorm';

export class userNameFamilyNameOptional1622303089647
    implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "firstName" DROP NOT NULL`
        );

        await queryRunner.query(
            `ALTER TABLE "users" ALTER COLUMN "lastName" DROP NOT NULL`
        );
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public async down(_queryRunner: QueryRunner): Promise<void> {}
}
