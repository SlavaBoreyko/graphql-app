import { Post, Prisma } from ".prisma/client";
import { Context } from "../../index"
import { canUserMutatePost } from "../../utils/canUserMutate";

interface PostArgs {
    post: {
        title?: string
        content?: string
    }
}

interface PostPayloadType {
    userErrors: {
        message: string
    }[],
    post: Post | Prisma.Prisma__PostClient<Post> | null
}

export const postResolvers = {
    postCreate: async(
        _: any, 
        { post }: PostArgs, 
        { prisma, userInfo }: Context
    ):Promise<PostPayloadType> => {
            if(!userInfo) {
                return {
                    userErrors: [{
                        message: "Unauthenticated"
                    }],
                    post: null
                }
            }

            const { title, content } = post
            if(!title || !content) {
                return {
                    userErrors: [{
                        message: "You must provide title and conctent for post."
                    }],
                    post: null
                }
            }

        return {
            userErrors: [],
            post: prisma.post.create({
                data: {
                    title,
                    content,
                    authorId: userInfo.userId
                }
            })
        }
    },

    postUpdate: async(
        _: any, { postId, post }: {postId: string, post: PostArgs["post"]},
        {prisma, userInfo }: Context
    ): Promise<PostPayloadType> => {
        if(!userInfo) {
            return {
                userErrors: [{
                    message: "Unauthenticated"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        })

        if(error) return error;

        const { title, content } = post

        if(!title && !content){
            return {
                userErrors: [
                    {
                        message: "Need to have at least one field"
                    }
                ],
                post: null
            }
        }

        const existingPost = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if(!existingPost){
            return {
                userErrors: [
                    {
                        message: "Post does not exists"
                    }
                ],
                post: null
            }
        }

        let payloadToUpdate = {
            title,
            content
        }

        if(!title) delete payloadToUpdate.title
        if(!content) delete payloadToUpdate.content

        return {
            userErrors: [],
            post: prisma.post.update({
                data: {
                    ...payloadToUpdate
                },
                where: {
                    id: Number(postId)
                }
            })
        }
    },

    postDelete: async(
        _: any, { postId }: 
        { postId: string }, 
        { prisma, userInfo }: Context
    ): Promise<PostPayloadType> => {
        if(!userInfo) {
            return {
                userErrors: [{
                    message: "Unauthenticated"
                }],
                post: null
            }
        }

        const error = await canUserMutatePost({
            userId: userInfo.userId,
            postId: Number(postId),
            prisma
        })

        if(error) return error;

        const post = await prisma.post.findUnique({
            where: {
                id: Number(postId)
            }
        })

        if(!post){
            return {
                userErrors: [
                    {
                        message: "Post does not exists"
                    }
                ],
                post: null
            }
        }

        await prisma.post.delete({
            where: {
                id: Number(postId)
            }
        })

        return {
            userErrors: [],
            post
        }
    }
}