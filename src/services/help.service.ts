function isMobile(userAgent:string) {
    return /iPhone|iPad|iPod|midp|rv:1.2.3.4|ucweb|windows ce|windows mobile|BlackBerry|IEMobile|Opera Mini|Android/i.test(userAgent)
}

export {
    isMobile as IsMobile
}