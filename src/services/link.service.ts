type ResetPasswordInput = {
    secure: boolean,
    domain: string,
    email: string,
    expires: Date,
    token: string
}

function getResetPasswordLink(p:ResetPasswordInput) {
    const protocol:string = p.secure ? 'https' : 'http'
    const encodedEmail = encodeURIComponent(p.email)
    return `${protocol}://${p.domain}/password-reset.html` +
           `?email=${encodedEmail}&expires=${p.expires}&token=${p.token}`
}

export {  
    getResetPasswordLink as GetResetPasswordLink
}
