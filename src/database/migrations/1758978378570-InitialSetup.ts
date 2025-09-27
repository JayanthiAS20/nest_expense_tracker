import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSetup1758978378570 implements MigrationInterface {
  name = 'InitialSetup1758978378570';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`setting\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdBy\` int NOT NULL, \`updatedBy\` int NULL, \`language\` enum ('english', 'tamil') NOT NULL DEFAULT 'english', \`isEmailNotificationEnabled\` tinyint NOT NULL DEFAULT 0, \`isNotificationEnabled\` tinyint NOT NULL DEFAULT 0, \`isBiometricEnabled\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deletedAt\` datetime(6) NULL, \`createdBy\` int NOT NULL, \`updatedBy\` int NULL, \`name\` varchar(255) NULL, \`email\` varchar(255) NULL, \`mobile\` varchar(255) NULL, \`password\` varchar(255) NULL, \`roles\` enum ('admin', 'super_admin', 'user') NOT NULL, \`status\` enum ('Active', 'Inactive') NOT NULL DEFAULT 'Active', \`isMobileVerified\` tinyint NOT NULL DEFAULT 0, \`blockUser\` tinyint NOT NULL DEFAULT 0, \`isEmailVerified\` tinyint NOT NULL DEFAULT 0, \`activeStatus\` tinyint NOT NULL DEFAULT 1, \`gender\` enum ('male', 'female', 'other') NULL, \`settingsId\` int NULL, INDEX \`IDX_29fd51e9cf9241d022c5a4e02e\` (\`mobile\`), FULLTEXT INDEX \`full_text_search\` (\`name\`, \`email\`), UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), UNIQUE INDEX \`REL_390395c3d8592e3e8d8422ce85\` (\`settingsId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user\` ADD CONSTRAINT \`FK_390395c3d8592e3e8d8422ce853\` FOREIGN KEY (\`settingsId\`) REFERENCES \`setting\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`user\` DROP FOREIGN KEY \`FK_390395c3d8592e3e8d8422ce853\``,
    );
    await queryRunner.query(
      `DROP INDEX \`REL_390395c3d8592e3e8d8422ce85\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_29fd51e9cf9241d022c5a4e02e\` ON \`user\``,
    );
    await queryRunner.query(
      `DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``,
    );
    await queryRunner.query(`DROP INDEX \`full_text_search\` ON \`user\``);

    await queryRunner.query(`DROP TABLE \`user\``);
    await queryRunner.query(`DROP TABLE \`setting\``);
  }
}
