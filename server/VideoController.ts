import axios from 'axios'
import { load } from 'cheerio'
import { Request, Response } from 'express'
import ApiError from '../shared/ApiError'
import { Video } from '../shared/Video'
import { isSet } from './utils'

namespace VideoController {
    function decodeFileLink(u: string) {
        u = u.replace(/_XDDD|_CDA|_ADC|_CXD|_QWE|_Q5|_IKSDE/g, "")
        u = decodeURIComponent(u)

        u = u.split('')
            .map(c => {
                const code = c.charCodeAt(0)
                return (code >= 33 && code <= 126) ? String.fromCharCode(33 + (code + 14) % 94) : c
            }).join('')

        u = u.replace(".cda.mp4", "")
            .replace(/.2cda.pl|.3cda.pl/g, ".cda.pl")

        return `https://${u}.mp4`
    }

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

        const data = JSON.parse(player)

        delete data.ads

        data.video.file = decodeFileLink(data.video.file)

        const title = load('<div />')
        title('div').html(data.title)
        data.video.title = title('div').text()

        res.json(data)
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

        const file = response.data.result.resp

        res.json({ file })
    }

    export async function comments(req: Request, res: Response) {
        const { id, offset } = req.body
        if (!isSet(id, offset)) {
            ApiError.BAD_REQUEST.raise(res)
            return
        }

        const url = 'https://www.cda.pl/a/moreComments'

        const fd = new FormData()
        fd.append('offset', offset)
        fd.append('age_confirm', '')

        const response = await axios.post(url, fd, {
            headers: {
                'Accept': 'application/json, text/javascript, */*; q=0.01',
                'Referer': Video.getLink(id)
            }
        }).catch(() => {})

        if (!response) {
            ApiError.NOT_FOUND.raise(res)
            return
        }

        res.json(response.data)
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
            ApiError.NOT_FOUND.raise(res)
            return
        }

        res.json(response.data)
    }
}

export default VideoController
