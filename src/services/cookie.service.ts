import { CreateCookieInput } from "../modules/authorization/auth.schema"

function nowPlusMinutes(delay: number): Date {
    let expires = new Date()
    expires.setMinutes(expires.getMinutes() + delay)
    return expires
}

function nowPlusDays(delay: number) :Date {
    let expires = new Date()
    expires.setDate(expires.getDate() + delay)
    return expires
}

function createCookie(p:CreateCookieInput
    ) : any {
        p.reply
        .setCookie(p.name, p.value, p.options) 
}

export { 
    createCookie as CreateCookie,
    nowPlusDays as NowPlusDays,
    nowPlusMinutes as NowPlusMinutes
}