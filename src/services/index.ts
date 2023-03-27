
import { CreateSession } from "./session.service"
import { GetUniqueSession } from "./session.service"
import { UpdateSession } from "./session.service"
import { RegenerateSession } from "./session.service"
import { Hash } from "./crypto.service"
import { Compare } from "./crypto.service"
import { GenerateSalt } from "./crypto.service"
import { Sign } from './crypto.service'
import { Verify } from "./crypto.service"
import { CreateCookie } from "./cookie.service"
import { ClearCookie } from "./cookie.service"
import { NowPlusMinutes } from "./cookie.service"
import { NowPlusDays } from "./cookie.service"
import { IsMobile} from "./help.service"
import { CreateJwt } from "./crypto.service"
import { SendMail } from "./mail.service"
import { GetResetPasswordLink } from './link.service'

export default {
    CreateSession,
    GetUniqueSession,
    UpdateSession,
    RegenerateSession,
    Hash,
    Compare,
    GenerateSalt,
    CreateJwt,
    Sign,
    Verify,
    CreateCookie,
    ClearCookie,
    NowPlusMinutes,
    NowPlusDays,
    IsMobile,
    SendMail,
    GetResetPasswordLink
}