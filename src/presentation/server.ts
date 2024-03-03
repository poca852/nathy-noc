import { MongoLogDatasource } from '../infrastructure/datasources/mongo-log.datasource';
import { LogRepositoryImpl } from '../infrastructure/repositories/log.repository.impl';
import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { SendWhatsapp } from '../domain/use-cases/send-whatsapp/send-whatsapp';
import { WsTransporter } from './whatsapp/whatsapp';


const logRepository = new LogRepositoryImpl(
  new MongoLogDatasource(),
);

const sendWhatsapp = new SendWhatsapp(new WsTransporter());

export class Server {

  public static async start() {

    CronService.createJob(
      '0 40 23 * * *',
      () => {
        const url = 'https://api.nathyapp.lat/api/empresa/get-open-rutas';

        new CheckService(
          logRepository,
          sendWhatsapp,
          undefined,
          ( error ) => console.log( error ),
        ).execute( url );
      },
      'UTC-3'
    );


  }


}


