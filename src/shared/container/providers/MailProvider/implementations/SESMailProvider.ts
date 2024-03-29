import { SES } from 'aws-sdk';
import fs from 'fs';
import handlebars from 'handlebars';
import nodemailer, { Transporter } from 'nodemailer';

import { IMailProvider } from '../IMailProvider';

class SESMailProvider implements IMailProvider {
  private client: Transporter;
  constructor() {
    this.client = nodemailer.createTransport({
      SES: new SES({
        apiVersion: '2010-12-01',
        region: process.env.AWS_SES_REGION,
      }),
    });
  }

  async sendMail(
    to: string,
    subject: string,
    variables: Record<string, unknown>,
    path: string
  ): Promise<void> {
    const templateFileContent = fs.readFileSync(path).toString('utf-8');

    const template = handlebars.compile(templateFileContent)(variables);

    await this.client.sendMail({
      to,
      from: 'Rentx <bruno.scassuncao@gmail.com>',
      subject,
      html: template,
    });
  }
}

export { SESMailProvider };
