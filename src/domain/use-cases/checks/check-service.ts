import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
import { LogRepository } from '../../repository/log.repository';
import { httpClientPlugin } from '../../../config/plugins/fetch.plugin';
import { EmailService } from '../../../presentation/email/email.service';

interface CheckServiceUseCase {
  execute(url: string): Promise<boolean>;
}


type SuccessCallback = (() => void) | undefined;
type ErrorCallback = ((error: string) => void) | undefined;

interface ResponseData {
  _id: string;
  nombre: string;
  email: string;
  phone: string;
  rutas: string[];
}


export class CheckService implements CheckServiceUseCase {

  constructor(
    private readonly logRepository: LogRepository,
    private readonly emailService: EmailService,
    private readonly successCallback: SuccessCallback,
    private readonly errorCallback: ErrorCallback
  ) { }


  public async execute(url: string): Promise<boolean> {

    try {
      const empresasWithRutasOpened = await httpClientPlugin.get<ResponseData[]>(url);

      if (empresasWithRutasOpened.length > 0) {

        const htmlBody = `
        <h1>Rutas Abiertas</h1>
        <ul>
          ${empresasWithRutasOpened.map(empresa => `
            <li>
              <strong>Empresa:</strong> ${empresa.nombre}<br>
              <strong>Rutas:</strong>
              <ul>
                ${empresa.rutas.map(ruta => `<li>${ruta}</li>`).join('')}
              </ul>
            </li>
          `).join('')}
        </ul>`;

        this.emailService.sendEmail({
          to: 'david-cuspoca@hotmail.com',
          subject: 'Rutas abiertas',
          htmlBody
        })

      }

      this.successCallback && this.successCallback();

      return true;
    } catch (error) {
      const errorMessage = `${url} is not ok. ${error}`;
      const log = new LogEntity({
        message: errorMessage,
        level: LogSeverityLevel.high,
        origin: 'check-service.ts'
      });
      this.logRepository.saveLog(log);

      this.errorCallback && this.errorCallback(errorMessage);

      return false;
    }

  }

}

