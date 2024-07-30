<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240816134452 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create Marker table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('
            CREATE TABLE marker (
                id INT AUTO_INCREMENT NOT NULL,
                latitude DOUBLE PRECISION NOT NULL, 
                longitude DOUBLE PRECISION NOT NULL, 
                title VARCHAR(255) NOT NULL, 
                description VARCHAR(510) NOT NULL, 
                type_id INT NOT NULL,
                photo VARCHAR(255) NOT NULL,
                link VARCHAR(255) NOT NULL, 
                created_at DATETIME NOT NULL, 
                PRIMARY KEY(id)
            )
            DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('DROP TABLE marker');
    }
}
