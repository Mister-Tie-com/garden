<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240902125936 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Update marker type';
    }

    public function up(Schema $schema): void
    {
        $this->addSql("INSERT INTO marker_type (name, description) VALUES (
                                                    'rental',
                                                    'Properties available for rent'
                                                    )"
        );
        $this->addSql("INSERT INTO marker_type (name, description) VALUES (
                                                    'sell',
                                                    'Properties available for sale')
                                                    ");
    }

    public function down(Schema $schema): void
    {
        $this->addSql("DELETE FROM marker WHERE type_id IN (1, 2)");
        $this->addSql("DELETE FROM marker_type WHERE name IN ('rental', 'sell')");
    }
}
