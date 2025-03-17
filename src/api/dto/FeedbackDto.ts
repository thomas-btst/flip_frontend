import { FeedbackUserDto } from "./User";

export interface FeedbackDto {
    rate: number,
    comment: string,
    date: string,
    user: FeedbackUserDto | null,
}

export interface CreateFeedbackDto {
    rate: number,
    comment: string,
}