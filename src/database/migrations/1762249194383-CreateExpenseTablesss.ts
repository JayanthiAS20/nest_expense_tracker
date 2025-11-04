import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateExpenseTablesss1762249194383 implements MigrationInterface {
  name = 'CreateExpenseTablesss1762249194383';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`expense\` DROP COLUMN \`date\``);
    await queryRunner.query(
      `ALTER TABLE \`expense\` ADD \`date\` datetime NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`expense\` DROP COLUMN \`date\``);
    await queryRunner.query(
      `ALTER TABLE \`expense\` ADD \`date\` date NOT NULL`,
    );
  }
}
