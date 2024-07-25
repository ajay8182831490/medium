import { PrismaClient } from "@prisma/client";
const authmiddleware = require('../../middleware/authMiddleware');
const prisma = new PrismaClient();
import { Request, response, Response } from "express";

import attachUserId from '../../middleware/atttachedUser'
import { ensureAuthenticated } from '../../middleware/authMiddleware';

interface AuthenticatedRequest extends Request {
    id: Number,
    authorid: Number

}

// create delete read all update sorting pagination


const express = require('express');
const router = express.Router()



// router.get('/createPost', ensureAuthenticated, attachUserId, (req: Request, res: Response) => {
//     res.json("hello");
// })
router.get('/createPost', ensureAuthenticated, attachUserId, async (req: Request, res: Response) => {
    const userId = (req as any).user.id;
    const { title, content } = req.body;

    await prisma.post.create({
        data: {
            authorid: userId,
            title,
            content


        }
    })
    res.redirect('/');
    res.json({ message: "blod created succeesfully" });

})

router.put('/update/:id', ensureAuthenticated, attachUserId, async (req: AuthenticatedRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const userId = (req as any).user.id;
    // we will check the author should be same of the post author

    const { title, content } = req.body;

    const post = await prisma.post.findUnique({
        where: {
            id: id
        }
    })
    if (!post) {
        res.status(401).json("post not found")
    }
    if (post?.authorid != userId) {
        return res.status(403).json("you are not authorize");
    }

    await prisma.post.update({
        where: { id: id },
        data: {
            title,
            content
        }
    })
    res.status(200).json("post updated successfully");
})
router.get('/post', ensureAuthenticated, attachUserId, async (req: AuthenticatedRequest, res: Response) => {

    const userId = (req as any).user.id;
    // we will check the author should be same of the post author



    const post = await prisma.post.findMany({
        where: {
            authorid: parseInt(userId)
        }
    })




    res.status(200).json(post);
})
router.delete('/delete/:id', ensureAuthenticated, attachUserId, async (req: AuthenticatedRequest, res: Response) => {
    const id = parseInt(req.params.id);
    const userId = (req as any).user.id;
    // we will check the author should be same of the post author

    const { title, content } = req.body;

    const post = await prisma.post.findUnique({
        where: {
            id: id
        }
    })
    if (!post) {
        res.status(401).json("post not found")
    }
    if (post?.authorid != userId) {
        return res.status(403).json("you are not authorize");
    }

    await prisma.post.delete({
        where: { id: id }

    })
    res.status(200).json("post deleted successfully");
})
//sorting pagination searching
router.post('/pagePost', async (req: Request, res: Response) => {
    // PAGE LIMIT
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sort = req.query.order === 'asc' ? 'asc' : 'dsc';
    const content = (req.query.content as string) || '';
    const sortBy = (req.query.sortBy as string) || 'createdAt';

    const skip = (page - 1) * limit;
    const post = await prisma.post.findMany({
        where: {
            OR: [
                { title: { contains: content, mode: 'insensitive' } },
                { content: { contains: content, mode: 'insensitive' } },
                { author: { name: { contains: content, mode: 'insensitive' } } }
            ],
        },
        orderBy: {
            [sortBy]: sort,
        },
        skip: skip,
        take: limit,


    })
    const totalPosts = await prisma.post.count({
        where: {

            OR: [
                { title: { contains: content, mode: 'insensitive' } },
                { content: { contains: content, mode: 'insensitive' } },
                { author: { name: { contains: content, mode: 'insensitive' } } }
            ],
        },
    });


    res.status(200).json({
        post,
        totalPages: Math.ceil(totalPosts / limit),
        currentPage: page,
    })




})










export default router;



