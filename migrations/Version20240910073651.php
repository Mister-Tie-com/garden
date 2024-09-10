<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240910073651 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add last position to user';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user ADD last_position JSON DEFAULT NULL');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE user DROP last_position');
    }
}
