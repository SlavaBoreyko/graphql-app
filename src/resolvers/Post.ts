import { Context } from ".."

interface PostParentType {
    authorId: number,
    bio: string,
    userId: number
}

export const Post = {
  user: (parent: PostParentType, __:any, { prisma }: Context) => {
    return prisma.user.findUnique({
        where: {
            id: parent.authorId
        }
    })
  }
}