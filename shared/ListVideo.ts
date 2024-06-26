import { Cheerio } from 'cheerio'
import { Element } from 'domhandler'
import { fixUrl } from '../server/utils'
import Video from './Video'

export default class ListVideo {
    constructor(
        public id: string,
        public title: string,
        public thumb: string,
        public duration: string,
        public quality: string,
        public isPremium: boolean
    ) {}

    static fromVideo(video: Video) {
        const h = Math.floor(video.duration / 3600)
        const m = Math.floor((video.duration % 3600) / 60)
        const s = video.duration % 60

        const duration = `${(h > 0) ? (h + ":") : ""}${m}:${s.toString().padStart(2, '0')}`

        return new ListVideo(
            video.id,
            video.title,
            video.thumb,
            duration,
            "",
            false
        )
    }

    static fromHtml = ($: Cheerio<Element>) => {
        const titleEl = $.find('a.link-title-visit')
        const id = Video.getId(titleEl.attr('href'))

        if (!id) return undefined

        return new ListVideo(
            id,
            titleEl.text().trim(),
            fixUrl($.find('img').attr('src')!),
            $.find('span.timeElem').text().trim(),
            $.find('span.hd-ico-elem').text().trim(),
            $.find('span.flag-video-premium').length > 0
        )
    }

    static fromJSON = (json: any) =>
        new ListVideo(json.id, json.title, json.thumb, json.duration, json.quality, json.isPremium)
}
