export class Video {

    static getId(url?: string): string {
        if (!url) return ''
        const urlArr = url.split('/')
        let id = urlArr.pop()
        if (id == 'vfilm') id = urlArr.pop()
        return id ?? ''
    }

    static getLink(id: string, quality: string = ''): string {
        const qualityStr = quality.length == 0 ? `?wersja=${quality}` : ''
        return `https://www.cda.pl/video/${id}${qualityStr}`
    }
}
