import { CheerioAPI } from 'cheerio'
import { fixUrl } from '../server/utils'
import Comment from './Comment'
import ListVideo from './ListVideo'

class Video {
    constructor(
        public id: string,
        public title: string,
        public thumb: string,
        public quality: string,
        public qualities: { [key: string]: string },
        public file: string,
        public duration: number,

        public desc: string,
        public uploadDate: string,
        public isPrivate: boolean,

        public authorId: string,
        public authorName: string,
        public authorPic: string,

        public inFolder: boolean,
        public folderId: string,
        public folderName: string,

        public comments: Comment[],

        public related: ListVideo[],

        public client: Video.Client,
    ) {}

    static getId(url?: string): string {
        if (!url) return ''
        const urlArr = url.split('/')
        let id = urlArr.pop()
        if (id == 'vfilm') id = urlArr.pop()
        return id ?? ''
    }

    static getLink(id: string, quality: string = ''): string {
        const qualityStr = quality.length > 0 ? `?wersja=${quality}` : ''
        return `https://www.cda.pl/video/${id}${qualityStr}`
    }

    static decodeFileLink(u: string) {
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

    static parseComments = ($: CheerioAPI) => {
        const commentEls = $('[id^=boxComm]')
        return commentEls.map((_, el) => Comment.fromHtml($(el), true)).get()
    }

    static fromHtml = ($: CheerioAPI, data: any): Video => {
        const vid = data.video

        const id = vid.id;

        const title = $('#naglowek h1').text().trim()

        const thumb = fixUrl(vid.thumb)
        const quality = vid.quality
        const qualities = vid.qualities
        const file = Video.decodeFileLink(vid.file)
        const duration = vid.duration

        const desc = $('span[itemprop="description"]').html()?.trim() ?? ''
        const uploadDate = $('meta[itemprop="uploadDate"]').attr('content') ?? ''
        const isPrivate = $('.private-video-info').length > 0

        const authorId = $('.DescrVID-left .pull-left a').attr('href') ?? ''
        const authorName = $('.DescrVID a.link-primary>span>span').text().trim()
        const authorPic = fixUrl($('.DescrVID-left .pull-left a img').attr('src') ?? '')

        const folderEl = $('.catalogtree-break .file-color')
        const inFolder = folderEl.length > 0
        const folderId = folderEl.attr('href') ?? ''
        const folderName = folderEl.text() ?? ''

        const comments = Video.parseComments($)

        const relatedEls = $('#rightCol .media-show')
        const related = relatedEls.map((_, el) => {
            return ListVideo.fromHtml($(el))
        }).get()

        const client = new Video.Client(3, vid.ts, vid.hash2)

        return new Video(
            id, title, thumb, quality, qualities, file, duration,
            desc, uploadDate, isPrivate,
            authorId, authorName, authorPic,
            inFolder, folderId, folderName,
            comments, related,
            client
        )
    }

    static fromJSON = (json: any) =>
        new Video(
            json.id, json.title, json.thumb, json.quality, json.qualities, json.file, json.duration,
            json.desc, json.uploadDate, json.isPrivate,
            json.authorId, json.authorName, json.authorPic,
            json.inFolder, json.folderId, json.folderName,
            json.comments.map(Comment.fromJSON),
            json.related.map(ListVideo.fromJSON),
            Video.Client.fromJSON(json.client)
        )
}

namespace Video {
    export class Client {
        constructor(
            public sequence: number,
            public ts: string,
            public key: string,
        ) {
        }

        static fromJSON = (json: any) =>
            new Client(json.sequence, json.ts, json.key)
    }
}

export default Video
