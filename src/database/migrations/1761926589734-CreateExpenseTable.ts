import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpenseTable1761926589734 implements MigrationInterface {
  name = 'CreateExpenseTable1761926589734';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`expense\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdBy\` int NOT NULL, \`updatedBy\` int NULL, \`title\` varchar(255) NOT NULL, \`amount\` decimal(10,2) NOT NULL, \`category\` varchar(255) NOT NULL, \`date\` date NOT NULL, \`description\` varchar(255) NULL, \`activeStatus\` tinyint NOT NULL DEFAULT 1, \`userId\` int NULL, INDEX \`IDX_74676b36db7274c47f3368323f\` (\`title\`), INDEX \`IDX_3005f26af8a717b9a2c5b8111c\` (\`category\`), INDEX \`IDX_0d55cba7e720838966e9d6ad5d\` (\`userId\`, \`activeStatus\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`provider\``);
    await queryRunner.query(
      `ALTER TABLE \`expense\` ADD CONSTRAINT \`FK_06e076479515578ab1933ab4375\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`expense\` DROP FOREIGN KEY \`FK_06e076479515578ab1933ab4375\``,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD \`provider\` varchar(255) NULL`,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_0d55cba7e720838966e9d6ad5d\` ON \`expense\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_3005f26af8a717b9a2c5b8111c\` ON \`expense\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_74676b36db7274c47f3368323f\` ON \`expense\``,
    );
    await queryRunner.query(`DROP TABLE \`expense\``);
  }
}
