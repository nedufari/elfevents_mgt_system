import { Injectable } from '@nestjs/common';
import { MailerService } from "@nestjs-modules/mailer";

@Injectable()
export class Mailer {
    constructor(private readonly mailerservice:MailerService){}

    async SendVerificationMail(email:string, accesscode: string,fullname:string):Promise<void>{
        const subject = "Event AccessCode Issuance";
    const content = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Guest Registration - AccessCode Issuance</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
          color: #333333;
          line-height: 1.6;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 10px;
        }
        .verification-heading {
          text-align: center;
          color: #800080;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .message {
          text-align: center;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .otp {
          text-align: center;
          font-size: 30px;
          color: #800080;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .instructions {
          font-size: 16px;
          line-height: 1.4;
          margin-bottom: 20px;
        }
        .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #800080;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #777777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://drive.google.com/your-logo-link-here" alt="elf events Logo" width="250" height="250" />
        </div>
        <h1 class="verification-heading">Dear, ${fullname}!</h1>
        <p class="message">Your Registration Access Code:</p>
        <p class="otp">${accesscode}</p>
        <div class="instructions">
          <p>
            Thank you for registering with us! Your Access Code is a key to a magical experience at our upcoming event.
          </p>
          <p>
            Use the Access Code provided above for seamless entry during the event. This unique code serves as your exclusive invitation.
          </p>
          <p>
            If you didn't request this Access Code, please disregard this email. Your data is secure with us.
          </p>
          <p>
            For any questions or assistance, contact our support team at <a class="button" href="mailto:support@elfevents.com">support@elfevents.com</a>
          </p>
        </div>
        <p class="footer">Events infused with Magic, powered by ElfEvents</p>
      </div>
    </body>
    </html>
    
    `;


        await this.mailerservice.sendMail({to:email,subject,html:content })
        
    }



    
    async SendPasswordResetLinkMail(email:string, resetlink: string):Promise<void>{
      const subject = "Password Reset Link";
      const content = `<!DOCTYPE html>
  <html>
    <head>
      <title>Forgot Password Reset Link</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f2f2f2;
          color: #333333;
          line-height: 1.6;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #ffffff;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .logo {
          text-align: center;
          margin-bottom: 10px;
        }
        .verification-heading {
          text-align: center;
          color: #800080;
          font-size: 20px;
          margin-bottom: 10px;
        }
        .message {
          text-align: center;
          font-size: 16px;
          margin-bottom: 20px;
        }
        .otp {
          text-align: center;
          font-size: 30px;
          color: #800080;
          font-weight: bold;
          margin-bottom: 20px;
        }
        .instructions {
          font-size: 16px;
          line-height: 1.4;
        }
        .button {
         
          color:#aa6c39;
          
        }
        .footer {
          text-align: center;
          margin-top: 20px;
          color: #777777;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="logo">
          <img src="https://drive.google.com/file/d/1zpO-SfrIUlGky2YdT9UCtNdyc_Tu0MLs/view?usp=drive_link" alt="elfevents Logo" width="250" height="250" />
        </div>
        <h1 class="verification-heading">Password Reset Token</h1>
        <p class="message"><span class="username">HI</span>,</p>
        <p class="otp">Your Password Reset Token : <span class="otp-code">${resetlink}</span></p>
        <div class="instructions">
          <p>
            We are sorry you can't get access into elf admin dashboard. Please use the Reset link  provided above to enter a new password.
          </p>
          <p>
            The password reset link is valid for a limited time, and it should be used to complete the password reset process.
          </p>
          <p>
            If you did not request this OTP, please ignore this email. Your account will remain secure.
          </p>
          <p >
            If you have any questions or need assistance, please don't hesitate to contact our support team at support@elfevents.com 
          </p>
        </div>
        <p class="footer">Events infused with Magic, powered by ElfEvents</p>
      </div>
    </body>
  </html>
  `;

      await this.mailerservice.sendMail({to:email,subject,html:content })
      
  }
}
