import { CreateCookieInput, ClearCookieInput } from "../modules/authorization/auth.schema"

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
        p.reply.cookies[p.name] = p.value
        p.reply
        .setCookie(p.name, p.value, p.options) 
}

function clearCookie(p:ClearCookieInput) {
    p.reply.cookies[p.name] = undefined
    p.reply
    .clearCookie(p.name, p.options) 
}

export { 
    createCookie as CreateCookie,
    clearCookie as ClearCookie,
    nowPlusDays as NowPlusDays,
    nowPlusMinutes as NowPlusMinutes
}