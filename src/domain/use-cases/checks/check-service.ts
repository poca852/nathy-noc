import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';
import { httpClientPlugin } from '../../../config/plugins/fetch.plugin';
import { SendWhatsapp } from '../send-whatsapp/send-whatsapp';

interface CheckServiceUseCase {
  execute( url: string ):Promise<boolean>;
}


type SuccessCallback = (() => void) | undefined;
type ErrorCallback = (( error: string ) => void) | undefined;

interface ResponseData {
  _id: string;
  nombre: string;
  emaiL: string;
  phone: string;
  rutas: string[];
}


export class CheckService implements CheckServiceUseCase {

  constructor(
    private readonly logRepository: LogRepository,
    private readonly sendWhatsapp: SendWhatsapp,
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) {}


  public async execute( url: string ): Promise<boolean> {

    try {
      const empresasWithRutasOpened = await httpClientPlugin.get<ResponseData[]>(url);

      if(empresasWithRutasOpened.length > 0) {

        empresasWithRutasOpened.forEach(empresa => {

          this.sendWhatsapp.execute(
            `Usted tiene las siguientes rutas abiertas: ${empresa.rutas}`, 
            empresa.phone
          )

        })

      }
      
      this.successCallback && this.successCallback();

      return true;
    } catch (error) {
      const errorMessage = `${url} is not ok. ${ error }`;
      const log = new LogEntity({ 
        message:errorMessage , 
        level: LogSeverityLevel.high,
        origin: 'check-service.ts'
       });
      this.logRepository.saveLog(log);
      
      this.errorCallback && this.errorCallback( errorMessage );

      return false;
    }

  }

}

