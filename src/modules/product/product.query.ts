import fp from 'fastify-plugin'

const buildQuery = fp(async (server) => {

    const builder = server.schema.builder

    const Product = builder.prismaObject('Product', {
        name: 'Product',
        fields: (t) => ({
            id: t.exposeString('id', { nullable: false }),
            title: t.exposeString('title', { nullable: false }),
            price: t.exposeFloat('price', { nullable: false }),
            content: t.exposeString('content', { nullable: true }),
        }),
    })

    builder.queryFields((t) => ({
        product: t.prismaField({
			type: Product,
			nullable: true,
            authScopes: {
                authenticate: true,
            },
			args: {
				id: t.arg.int({ required: true })
			},
			resolve: (query, root, args, ctx) =>
            ctx.prisma.product.findUnique({
                ...query,
                where: { id: String(args.id) }
            })
		}),
		manyProducts: t.prismaField({
			type: [Product],
			nullable: true,
            authScopes: {
                authenticate: true,
            },
			args: {},
			resolve: (query, root, args, ctx) =>
			ctx.prisma.product.findMany({...query})
		}),
    }))

    //await server.after()
    server.log.info('Product gql api added.')
})

export { buildQuery as BuildProductQuery }