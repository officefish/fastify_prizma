import fp from 'fastify-plugin'

class Post {
    title: string
    body: string
    createdAt: Date
    //author: User
    
    constructor(title: string, body: string ){  //, author: User) {
      this.title = title
      this.body = body
      this.createdAt = new Date(Date.now())
      //this.author = author
    }
}

const postQuery = fp(async (server) => {

    const builder = server.schema.builder

    builder.objectType(Post, {
        name: 'Post',
        description: 'Long necks, cool patterns, taller than you.',
        fields: (t) => ({
          title: t.exposeString('title', {}),
          body: t.exposeString('body', {}),          
        })
    })

    builder.queryFields((t) => ({
        manyPosts: t.field({
          type: [Post],
          resolve: () => { return [new Post('Пост 1', 'описание к посту 1') ] },
        }),
    }))

    //await server.after()
    server.log.info('Post gql api added.')
})

export { postQuery as BuildPostQuery }