import { MigrationInterface, QueryRunner } from 'typeorm';
import { Status } from '../../einheit/status.entity';

export class StatusMigration_17196485743 implements MigrationInterface {
  async up(queryRunner: QueryRunner) {
    const repository = queryRunner.manager.getRepository<Status>(Status);

    const statusCodes = [
      {
        code: 0,
        bezeichnung: 'Dringender Sprechwunsch',
        beschreibung: 'Dringender Kontakt zur Leitstelle erforderlich',
      },
      {
        code: 1,
        bezeichnung: 'Frei auf Funk',
        beschreibung: 'Einsatzbereit über Funk',
      },
      {
        code: 2,
        bezeichnung: 'Einsatzbereit auf Wache',
        beschreibung: 'Einsatzbereit auf der Wache',
      },
      {
        code: 3,
        bezeichnung: 'Einsatz übernommen',
        beschreibung: 'Einsatz/Auftrag übernommen, noch nicht am Einsatzort',
      },
      {
        code: 4,
        bezeichnung: 'Eintreffen am Einsatzort',
        beschreibung: 'Am Einsatzort eingetroffen',
      },
      {
        code: 5,
        bezeichnung: 'Sprechwunsch',
        beschreibung: 'Kontakt zur Leitstelle erforderlich',
      },
      {
        code: 6,
        bezeichnung: 'Einsatzbereit am Einsatzort',
        beschreibung: 'Am Einsatzort, aber für weitere Aufträge verfügbar',
      },
      {
        code: 7,
        bezeichnung: 'Patient aufgenommen',
        beschreibung: 'Patient aufgenommen',
      },
      {
        code: 8,
        bezeichnung: 'An Zielort',
        beschreibung:
          'Am Zielort (z.B. Krankenhaus) angekommen, Patient wird übergeben',
      },
      {
        code: 9,
        bezeichnung: 'Außerhalb des Landkreises',
        beschreibung:
          'Außerhalb des Landkreises, nicht für weitere Aufträge verfügbar',
      },
    ];

    for (const _status of statusCodes) {
      const status = repository.create({
        ..._status,
      });
      await repository.save(status);
    }
  }

  async down() {
    // Implement your migration rollback here
  }
}
