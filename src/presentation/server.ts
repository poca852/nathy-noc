import { MongoLogDatasource } from '../infrastructure/datasources/mongo-log.datasource';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { EmailService } from './email/email.service';


const logRepository = new LogRepositoryImpl(
  new MongoLogDatasource(),
);

const emailService = new EmailService();

export class Server {

  public static async start() {

    CronService.createJob(
      '0 40 23 * * *',
      () => {
        const url = 'https://api.nathyapp.lat/api/empresa/get-open-rutas';

        new CheckService(
          logRepository,
          emailService,
          undefined,
          ( error ) => console.log( error ),
        ).execute( url );
      },
      'UTC-3'
    );


  }


}


