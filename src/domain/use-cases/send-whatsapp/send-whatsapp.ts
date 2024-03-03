import { WsTransporter } from "../../../presentation/whatsapp/whatsapp"

interface SendWhatsappUseCase {
    execute:(message: string, phone: string) => Promise<boolean>
}

export class SendWhatsapp implements SendWhatsappUseCase {

    constructor(
        private readonly wsTransporter: WsTransporter,
    ){}

    async execute(message: string, phone: string): Promise<boolean> {
        try {   
    
            const sent = await this.wsTransporter.sendMsg({message, phone})
            return sent;

        } catch (error) {
            console.log(error);
            return false;
        }
    }

}