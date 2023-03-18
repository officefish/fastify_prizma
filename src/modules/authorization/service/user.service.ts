import { PrismaClient } from "@prisma/client"

async function getUser(prisma:PrismaClient, userId: string) {
    // Get the record from the "user" collection
      // with an id matching the one in the access token.
    //   const user = await getCollection('user').findOne({
    //     _id: ObjectID(decodedAccessToken.userId)
    //   });
    const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
    })
    return user

}

async function createUser(prisma:PrismaClient, data:any) {
    const user = await prisma.user.create({ data })
    return user
}

async function updatePassword(prisma:PrismaClient, userId: string, newPassword: string) {

}

async function updatePasswordWithEmail(prisma:PrismaClient, email: string, newPassword: string) {

}

export { 
    getUser as GetUser, 
    createUser as CreateUser, 
    updatePassword as UpdatePassword,
    updatePasswordWithEmail as UpdatePasswordWithEmail
 }
