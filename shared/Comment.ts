import { Cheerio, load } from 'cheerio'
import { Element } from 'domhandler'

export default class Comment {
    constructor(
        public id: string,
        public content: string,
        public date: string,
        public points: string,

        public author: CommentAuthor,

        public replies: Comment[],
        public replyCount: number,
    ) {}

    static parseReplies = (html: string): Comment[] => {
        const $ = load(html)
        const rps = $(".subcomment")
        return rps.map((_, el) => Comment.fromHtml($(el))).get()
    }

    static fromHtml = (box: Cheerio<Element>, isMain: boolean = false): Comment => {
        let com = box.find(".komentarz").first()
        if (com.length === 0) com = box

        const id = com.find(".tresc").attr("id")?.split("kom_tresc")[1] ?? ''
        const points = com.find(".commentRate").text().slice(1) || "0"
        const date = com.find(".commentDate1").text()
        const content = com.find(".tresc").first().children().remove().end().text().trim()

        const aName = com.find(".autor1").text().trim()
        const isAnon = aName.length === 0
        const authorName = isAnon ? com.find(".anonim").first().text().trim() : aName
        const authorPic = com.find(".commentAvatar img").attr("src")?.replace("//", "https://") ?? ''

        const replies = isMain ? Comment.parseReplies(box.html() || '') : []

        let replyCount = replies.length
        if (isMain) {
            const moreRpBtn = box.children('.autor1').last()
            const text = moreRpBtn.text() ?? ''
            const match = text.match(/\[(\d+)]/)
            if (match) replyCount += parseInt(match[1])
        }

        return new Comment(
            id, content, date, points,
            new CommentAuthor(isAnon, authorName, authorPic),
            replies, replyCount
        )
    }

    static fromJSON = (json: any) =>
        new Comment(
            json.id,
            json.content,
            json.date,
            json.points,
            CommentAuthor.fromJSON(json.author),
            json.replies.map(Comment.fromJSON),
            json.replyCount,
        )
}

export class CommentAuthor {
    constructor(
        public isAnon: boolean,
        public name: string,
        public pic: string,
    ) {}

    static fromJSON = (json: any) =>
        new CommentAuthor(json.isAnon, json.name, json.pic)
}
