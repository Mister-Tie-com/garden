<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240902123427 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'create marker type table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('
        CREATE TABLE marker_type (
            id INT AUTO_INCREMENT NOT NULL,
            name VARCHAR(255) NOT NULL,
            description VARCHAR(255) NOT NULL,
            PRIMARY KEY(id)
         ) 
        DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
    ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE marker_type');
    }
}
