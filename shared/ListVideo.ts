import { Cheerio } from 'cheerio'
import { Element } from 'domhandler'
import { fixUrl } from '../server/utils'
import { Video } from './Video'

export default class ListVideo {
    constructor(
        public id: string,
        public title: string,
        public thumb: string,
        public duration: string,
        public quality: string,
        public isPremium: boolean
    ) {}

    static fromHtml = ($: Cheerio<Element>) => {
        const titleEl = $.find('a.link-title-visit')

        return new ListVideo(
            Video.getId(titleEl.attr('href')),
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
