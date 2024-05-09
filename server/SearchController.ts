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

        const url = `https://www.cda.pl/video/show/${query}`

        const response = await axios.get(url.toString()).catch(() => {})

        if (!response) {
            ApiError.NOT_FOUND.raise(res)
            return
        }

        const $ = load(response.data)

        const videos = $('div.row-video-clip-wrapper div.video-clip')
            .map((_, el) => ListVideo.fromHtml($(el))).get()

        res.json(videos)
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
