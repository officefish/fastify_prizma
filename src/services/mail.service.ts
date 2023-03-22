import {Transporter, SendMailOptions} from "nodemailer"

async function sendMail(mailer:Transporter, options:SendMailOptions) {
    console.log(mailer)
    console.log(options)
    return await mailer.sendMail(options)
}

export { sendMail as SendMail }