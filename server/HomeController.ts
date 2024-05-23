import axios from 'axios'
import { load } from 'cheerio'
import { Request, Response } from 'express'
import ApiError from '../shared/ApiError'
import Category from '../shared/Category'
import ListVideo from '../shared/ListVideo'
import { isSet, switchCase } from './utils'

namespace HomeController {
    async function getVideos(res: Response, url: string) {
        const response = await axios.get(url).catch(() => {})

        if (!response) {
            ApiError.NOT_FOUND.raise(res)
            return
        }

        const $ = load(response.data)

        const videos = $('div.video-clip, div.videoInfo')
            .map((_, el) => ListVideo.fromHtml($(el)))
            .get()
            .filter(v => v !== undefined)

        const hasNext = $('.paginationControl a.sbmNext').length > 0 && videos.length > 0

        return {
            $,
            videos,
            hasNext
        }
    }

    export async function index(req: Request, res: Response) {
        const page = req.body.page || 1
        const order: string = req.body.order || 'default'

        const url = switchCase(order, {
            top: `https://www.cda.pl/video/p${page}?o=top&k=tydzien`,
            new: `https://www.cda.pl/video/najnowsze/p${page}`,
            default: `https://www.cda.pl/video/p${page}`
        })

        if (isNaN(page) || page < 1) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        const data = await getVideos(res, url)
        if (!data) return

        const { videos, hasNext } = data

        res.json({ videos, hasNext })
    }

    export async function category(req: Request, res: Response) {
        const id = req.body.id
        let page = req.body.page || 1

        if (isNaN(page) || page < 1 || !isSet(id)) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        const url = `https://www.cda.pl/video/${id}/${page}`

        const data = await getVideos(res, url)
        if (!data) return

        const { $, videos, hasNext } = data

        const creatorEls = $('a.tube-wrap')
        const creators = creatorEls.map((_, el) => Category.Creator.fromHtml($(el))).get()

        res.json({
            videos,
            creators,
            hasNext
        })
    }

    export async function categories(_: Request, res: Response) {
        const response = await axios.get('https://www.cda.pl/video').catch(() => {})

        if (!response) {
            ApiError.NOT_FOUND.raise(res)
            return
        }

        const $ = load(response.data)

        const cats = $('ul.kategoryList:last a.kategoryBox[href*="/video/"]')
            .map((_, el) => Category.fromHtml($(el))).get()

        res.json(cats)
    }
}

export default HomeController
