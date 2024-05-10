export default class VideoClient {
    constructor(
        public sequence: number,
        public ts: string,
        public key: string,
    ) {}

    static fromJSON = (json: any) =>
        new VideoClient(json.sequence, json.ts, json.key)
}
