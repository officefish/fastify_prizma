import fp from 'fastify-plugin'

import User from '../../../prisma/pothos-types'

const buildQuery = fp(async (server) => {

    const builder = server.schema.builder

    const User = builder.prismaObject('User', {
        name: 'User',
        fields: (t) => ({
            id: t.exposeString('id', { nullable: false }),
            name: t.exposeString('name', { nullable: true }),
            email: t.exposeString('email', { nullable: false }),
        }),
    })

    builder.queryFields((t) => ({
        user: t.prismaField({
            type: User,
            nullable: true,
            args: {
                id: t.arg.int({ required: true })
            },
            authScopes: {
                authenticate: true,
            },
            resolve: (query, root, args, context) =>
            context.prisma.user.findUnique({
                ...query,
                where: { id: String(args.id) }
            })
        }),
        manyUsers: t.prismaField({
            type: [User],
            nullable: false,
            authScopes: {
                authenticate: true,
            },
            args: {},
            resolve: (query, root, args, context) =>
            context.prisma.user.findMany({...query})
        })
    }))

    //await server.after()
    server.log.info('User gql api added.')
})

export { buildQuery as BuildUserQuery }