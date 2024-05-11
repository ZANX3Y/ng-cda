import { Cheerio } from 'cheerio'
import { Element } from 'domhandler'
import { fixUrl } from '../server/utils'

class Category {
    constructor(
        public id: string,
        public name: string,
        public videos: string
    ) {}

    static fromHtml = ($: Cheerio<Element>) => new Category(
        $.attr('href')?.match(/\/video\/([^/]+)/)?.[1] ?? '',
        $.find('span.txt').text().trim(),
        $.find('span.count-category').text().trim()
    )

    static fromJSON = (json: any) =>
        new Category(json.id, json.name, json.videos)
}

namespace Category {
    export class Creator {
        constructor(
            public id: string,
            public name: string,
            public pic: string
        ) {}

        static fromHtml = ($: Cheerio<Element>) => new Creator(
            $.attr('href')?.split('/').pop() ?? '',
            $.find('span.tube-name-content').text().trim(),
            fixUrl($.find('img.profile').attr('src') ?? '')
        )

        static fromJSON = (json: any) =>
            new Creator(json.id, json.name, json.pic)
    }
}

export default Category
