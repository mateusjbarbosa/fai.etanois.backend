import * as nodemailer from 'nodemailer'
import Configuration from '../../config/config'

class Nodemailer {
  private transporter;
  private source = `Etanóis ${Configuration.email.auth.user}`;

  constructor() {
    const info_email = Configuration.email;

    this.transporter = nodemailer.createTransport({
      host: info_email.host,
      port: info_email.port,
      secure: info_email.secure,
      auth: info_email.auth,
    });
  }

  public sendEmailRecoverPassword(email: string, token: string) {
    return this.transporter.sendMail({
      from: this.source,
      to: email,
      subject: 'Recuperar senha',
      text: token
    });
  }

  public sendEmailActivateAccount(email: string, token: string) {
    return this.transporter.sendMail({
      from: this.source,
      to: email,
      subject: 'Ativar conta',
      text: token
    });
  }
}

export default new Nodemailer();