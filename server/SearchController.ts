import axios from 'axios'
import { load } from 'cheerio'
import { Request, Response } from 'express'
import ApiError from '../shared/ApiError'
import ListVideo from '../shared/ListVideo'

namespace SearchController {
    export async function index(req: Request, res: Response) {
        const query = req.body.query?.trim()?.replace(/\s+/g, '_') ?? ''

        if (query.length < 2) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        let { page, duration, sort } = req.body

        page = parseInt(page)
        page = isNaN(page) ? 1 : page
        const pagePart = page > 1 ? `/p${page}` : ''

        const url = new URL(`https://www.cda.pl/video/show/${query}${pagePart}`)

        if (duration && duration.length > 0)
            url.searchParams.append('duration', duration)
        if (sort && sort.length > 0)
            url.searchParams.append('s', sort)

        const response = await axios.get(url.toString()).catch(() => {})

        if (!response) {
            res.json({ videos: [], hasNext: false })
            return
        }

        const $ = load(response.data)

        const videos = $('div.row-video-clip-wrapper div.video-clip')
            .map((_, el) => ListVideo.fromHtml($(el)))
            .get()
            .filter(v => v !== undefined)

        const hasNext = $('.paginationControl a.sbmNext').length > 0 && videos.length > 0

        res.json({ videos, hasNext })
    }

    export async function suggest(req: Request, res: Response) {
        let query = req.body?.query?.trim() ?? ''

        if (query.length < 2) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        const url = new URL('https://api.cda.pl/q.php')
        url.searchParams.append('q', query)

        const response = await axios.get(url.toString()).catch(() => {})

        if (!response) {
            ApiError.NOT_FOUND.raise(res)
            return
        }

        const list = response.data.map((item: { v: string, c: number }) => item.v)

        res.json(list)
    }
}

export default SearchController
