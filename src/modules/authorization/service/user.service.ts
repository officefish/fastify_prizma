import { PrismaClient, Prisma } from "@prisma/client"

type d = Prisma.UserWhereUniqueInput

async function getUniqueUser(prisma:PrismaClient,  data:Prisma.UserWhereUniqueInput) {
    const user = await prisma.user.findUnique({where: data})
    return user
}

async function createUser(prisma:PrismaClient, data:Prisma.UserCreateInput) {
    const user = await prisma.user.create({data})
    return user
}

async function updatePassword(prisma:PrismaClient, userId: string, newPassword: string) {

}

async function updatePasswordWithEmail(prisma:PrismaClient, email: string, newPassword: string) {

}

export { 
    getUniqueUser as GetUniqueUser, 
    createUser as CreateUser, 
    updatePassword as UpdatePassword,
    updatePasswordWithEmail as UpdatePasswordWithEmail
 }
