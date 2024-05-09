export default class VideoClient {
    constructor(
        public sequence: string,
        public ts: string,
        public key: string,
    ) {}

    static fromJSON = (json: any) =>
        new VideoClient(json.sequence, json.ts, json.key)
}
