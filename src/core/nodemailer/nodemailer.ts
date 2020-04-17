import * as nodemailer from 'nodemailer'

class Nodemailer {
  constructor() {}

  public sendEmail(email: string, token: string) {
    const tranporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'joaovitorteixeira10.jvt@gmail.com',
        pass: 'teste',
      }
    });

    return tranporter.sendMail({
      from: 'Etanóis <joaovitorteixeira10.jvt@gmail.com>',
      to: email,
      subject: 'Recuperar senha',
      text: token
    });
  }
}

export default new Nodemailer();