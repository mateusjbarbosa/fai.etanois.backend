import * as nodemailer from 'nodemailer'

class Nodemailer {
  private transporter;
  private source = 'Etanóis <joaovitorteixeira10.jvt@gmail.com>';

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'joaovitorteixeira10.jvt@gmail.com',
        pass: 'teste',
      }
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