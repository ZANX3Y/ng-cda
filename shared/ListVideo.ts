import { Cheerio } from 'cheerio'
import { Element } from 'domhandler'
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
            titleEl.text(),
            $.find('img.video-clip-image').attr('src')?.replace('//', 'https://')!,
            $.find('span.timeElem').text(),
            $.find('span.hd-ico-elem').text(),
            $.find('span.flag-video-premium').length > 0
        )
    }

    static fromJSON = (json: any) =>
        new ListVideo(json.id, json.title, json.thumb, json.duration, json.quality, json.isPremium)
}
