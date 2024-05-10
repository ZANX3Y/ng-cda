import axios from 'axios'
import { load } from 'cheerio'
import { Request, Response } from 'express'
import ApiError from '../shared/ApiError'
import Video from '../shared/Video'
import { isSet } from './utils'

namespace VideoController {
    export async function index(req: Request, res: Response) {
        const { id } = req.body
        if (!isSet(id)) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        const url = Video.getLink(id)
        const fd = new FormData()
        fd.append('age_confirm', '')

        const response = await axios.post(url, fd).catch(() => {})

        if (!response) {
            ApiError.NOT_FOUND.raise(res)
            return
        }

        const $ = load(response.data)

        const player = $('div[player_data]').attr('player_data')
        if (!player) {
            const isPremium = $('.player-prem-bg-text').length > 0
            const err = isPremium ? ApiError.VIDEO_PREMIUM : ApiError.NOT_FOUND
            err.raise(res)
            return
        }

        const video = Video.fromHtml($, JSON.parse(player))
        res.json(video)
    }

    export async function file(req: Request, res: Response) {
        const { id, quality, client } = req.body
        const { sequence, ts, key } = client

        if (!isSet(id, quality, sequence, ts, key)) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        const url = Video.getLink(id)
        const data = {
            id: sequence,
            jsonrpc: '2.0',
            method: 'videoGetLink',
            params: [id, quality, ts, key, {}]
        }

        const response = await axios.post(url, data, {
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': url
            }
        }).catch(() => {})

        if (!response) {
            ApiError.NOT_FOUND.raise(res)
            return
        }

        res.json({
            file: response.data.result.resp
        })
    }
}

export default VideoController
