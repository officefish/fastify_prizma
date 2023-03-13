import { PrismaClient } from '@prisma/client'

async function mock(prisma: PrismaClient) {
  //await prisma.user.deleteMany()
  const usersCount = await prisma.user.count()
  console.log({ users_count: usersCount })
}

export { mock }