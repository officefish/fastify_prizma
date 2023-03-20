
import { GetUniqueUser } from "./user.service"
import { CreateUser } from "./user.service"
import { UpdatePassword } from "./user.service"
import { CreateSession } from "./session.service"
import { GetUniqueSession } from "./session.service"
import { UpdateSession } from "./session.service"
import { UpdatePasswordWithEmail } from "./user.service"
import { Hash } from "./crypto.service"
import { Compare } from "./crypto.service"
import { GenerateSalt } from "./crypto.service"
import { Sign } from './crypto.service'
import { Verify } from "./crypto.service"
import { CreateCookie } from "./cookie.service"
import { NowPlusMinutes } from "./cookie.service"
import { NowPlusDays } from "./cookie.service"
import { IsMobile} from "./help.service"
import { CreateJwt } from "./crypto.service"
import { SendMail } from "./mail.service"

export default {
    GetUniqueUser,
    CreateUser,
    UpdatePassword,
    CreateSession,
    GetUniqueSession,
    UpdateSession,
    UpdatePasswordWithEmail,
    Hash,
    Compare,
    GenerateSalt,
    CreateJwt,
    Sign,
    Verify,
    CreateCookie,
    NowPlusMinutes,
    NowPlusDays,
    IsMobile,
    SendMail
}