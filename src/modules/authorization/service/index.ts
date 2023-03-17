
import { GetUser } from "./user.service"
import { UpdatePassword } from "./user.service"
import { GetSession } from "./session.service"
import { UpdateSession } from "./session.service"
import { UpdatePasswordWithEmail } from "./user.service"
import { MakeHash } from "./crypto.service"
import { Compare } from "./crypto.service"
import { GenerateSalt } from "./crypto.service"
import { CreateCookie } from "./cookie.service"
import { GetExpires } from "./cookie.service"

export default {
    GetUser,
    UpdatePassword,
    GetSession,
    UpdateSession,
    UpdatePasswordWithEmail,
    MakeHash,
    Compare,
    GenerateSalt,
    CreateCookie,
    GetExpires
}