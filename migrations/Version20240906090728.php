<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20240906090728 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Add  link marker to user';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE marker ADD user_id INT DEFAULT NULL');

        $this->addSql('CREATE INDEX IDX_82CF20FEA76ED395 ON marker (user_id)');

        $this->addSql('ALTER TABLE marker ADD CONSTRAINT FK_82CF20FEA76ED395 FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE CASCADE');

        $this->addSql('
            ALTER TABLE marker 
                CHANGE description description VARCHAR(255) NOT NULL,
                CHANGE type_id type_id INT DEFAULT NULL
        ');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE marker DROP FOREIGN KEY FK_82CF20FEA76ED395');

        $this->addSql('DROP INDEX IDX_82CF20FEA76ED395 ON marker');

        $this->addSql('ALTER TABLE marker DROP user_id');

        $this->addSql('
            ALTER TABLE marker 
                CHANGE description description VARCHAR(510) NOT NULL,
                CHANGE type_id type_id INT NOT NULL
        ');
    }
}
