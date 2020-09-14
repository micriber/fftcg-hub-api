import { MigrationInterface, QueryRunner } from 'typeorm';

export class userCardTable1598638695662 implements MigrationInterface {
    name = 'userCardTable1598638695662';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "userCards_version_enum" AS ENUM('classic', 'foil', 'full-art')`
        );
        await queryRunner.query(
            `CREATE TABLE "userCards" ("quantity" integer NOT NULL, "version" "userCards_version_enum" NOT NULL DEFAULT 'classic', "userId" uuid NOT NULL, "cardId" uuid NOT NULL, CONSTRAINT "PK_1efb7ce4c4b40d92ae769f090cd" PRIMARY KEY ("userId", "cardId", "version"))`
        );
        await queryRunner.query(
            `ALTER TABLE "userCards" ADD CONSTRAINT "FK_52e880d75a6c0ce6010f746eb66" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "userCards" ADD CONSTRAINT "FK_73f0fd991d03ede261d79e60bcc" FOREIGN KEY ("cardId") REFERENCES "cards"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "userCards" DROP CONSTRAINT "FK_73f0fd991d03ede261d79e60bcc"`
        );
        await queryRunner.query(
            `ALTER TABLE "userCards" DROP CONSTRAINT "FK_52e880d75a6c0ce6010f746eb66"`
        );
        await queryRunner.query(`DROP TABLE "userCards"`);
        await queryRunner.query(`DROP TYPE "userCards_version_enum"`);
    }
}
