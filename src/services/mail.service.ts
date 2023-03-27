
import {Transporter, SendMailOptions} from "nodemailer"

async function sendMail(mailer:Transporter, options:SendMailOptions) {
    return await mailer.sendMail(options)
}


export { 
    sendMail as SendMail, 
}