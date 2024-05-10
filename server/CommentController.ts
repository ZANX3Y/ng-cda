import axios from 'axios'
import { load } from 'cheerio'
import { Request, Response } from 'express'
import ApiError from '../shared/ApiError'
import Comment from '../shared/Comment'
import Video from '../shared/Video'
import { isSet } from './utils'

namespace CommentController {
    export async function index(req: Request, res: Response) {
        const { id, offset } = req.body
        if (!isSet(id, offset)) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        const url = 'https://www.cda.pl/a/moreComments'

        const fd = new FormData()
        fd.append('offset', offset)

        const response = await axios.post(url, fd, {
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': Video.getLink(id)
            }
        }).catch(() => {})

        if (!response) {
            res.json([])
            return
        }

        const $ = load(response.data.html)
        const comments = Video.parseComments($)

        res.json(comments)
    }

    export async function replies(req: Request, res: Response) {
        const { id, commentId, client } = req.body
        const { sequence } = client

        if (!isSet(id, sequence, commentId)) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        const url = Video.getLink(id)

        const data = {
            id: sequence,
            jsonrpc: '2.0',
            method: 'dobierzWszystkieOdpowiedzi',
            params: [commentId, id.slice(0, -2), 'video', {}]
        }

        const response = await axios.post(url, data, {
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': url
            }
        }).catch(() => {})

        if (!response) {
            res.json([])
            return
        }

        const comments = Comment.parseReplies(response.data.result)

        res.json(comments)
    }

    export async function upvote(req: Request, res: Response) {
        const { id, commentId } = req.body
        if (!isSet(id, commentId)) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        const url = 'https://www.cda.pl/a/complus'

        const fd = new FormData()
        fd.append('id', commentId)

        const response = await axios.post(url, fd, {
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': Video.getLink(id)
            }
        }).catch(() => {})

        res.json(response?.data)
    }

    async function addComment(res: Response, id: string, data: FormData) {
        const url = 'https://www.cda.pl/a/comment'

        const response = await axios.post(url, data, {
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': Video.getLink(id)
            }
        }).catch(() => {})

        if (!response) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        if (response.data.status != 'ok') {
            res.json(response.data)
            return
        }

        return load(response.data.html)
    }

    export async function add(req: Request, res: Response) {
        const { id, content } = req.body
        if (!isSet(id, content)) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }
        const fd = new FormData()
        fd.append('t', content)

        const $ = await addComment(res, id, fd)
        if (!$) return

        const comment = Comment.fromHtml($('[id^=boxComm]').first(), true)
        res.json(comment)
    }

    export async function reply(req: Request, res: Response) {
        const { id, parentID, targetID, content } = req.body
        if (!isSet(id, parentID, targetID, content)) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        const fd = new FormData()
        fd.append('t', content)
        fd.append('parent_id', parentID)
        fd.append('login', 'anonim')
        fd.append('answer_to', targetID)

        const $ = await addComment(res, id, fd)
        if (!$) return

        const comment = Comment.fromHtml($('.subcomment').first())
        res.json(comment)
    }
}

export default CommentController
