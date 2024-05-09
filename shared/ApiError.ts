import { Response } from 'express'

export default class ApiError {
    static readonly BAD_REQUEST = new ApiError('BAD_REQUEST')
    static readonly NOT_FOUND = new ApiError('NOT_FOUND')
    static readonly VIDEO_PREMIUM = new ApiError('VIDEO_PREMIUM')

    private constructor(private readonly id: string) {}

    static fromId = (id: string) => new ApiError(id)

    raise = (res: Response) => res.json({ error: this.id })

    equals = (other: ApiError) => this.id === other.id
}
