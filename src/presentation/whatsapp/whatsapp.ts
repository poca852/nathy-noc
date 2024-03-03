import { Client, LocalAuth } from "whatsapp-web.js";
import qrcode from 'qrcode-terminal';

export class WsTransporter extends Client {

    private status = false;

    constructor() {
        super({
            authStrategy: new LocalAuth(),
            puppeteer: {
                headless: true,
                args: [
                    "--disable-setuid-sandbox",
                    "--unhandled-rejections=strict",
                ],
            },
        });
        
        this.on("ready", () => {
            this.status = true;
            console.log("LOGIN_SUCCESS");
        });
        
        this.on("auth_failure", () => {
            this.status = false;
            console.log("LOGIN_FAIL");
        });
        
        this.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });
        
        this.initialize();
    }

    async sendMsg(opts: { message: string; phone: string }): Promise<any> {
        try {
            if (!this.status) return Promise.resolve({ error: "WAIT_LOGIN" });
            const { message, phone } = opts;
            await this.sendMessage(`${phone}@c.us`, message);
            return true;
        } catch (e: any) {
            return Promise.resolve({ error: e.message });
        }
    }

}