import { Context } from ".."

export const Query = {
  posts: (_:any, __:any, { prisma }: Context) => {
    const posts = prisma.post.findMany({
      orderBy: [
        {
          createdAt: "desc"
        }
      ]
    })

    return posts
  }
}