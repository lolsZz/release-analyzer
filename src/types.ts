export interface Reaction {
    totalCount: number;
    type: string;
}

export interface Contributor {
    login: string;
    contributions: number;
}

export interface ReleaseNote {
    tagName: string;
    name: string | null;
    body: string | null;
    createdAt: string;
    url: string;
    reactions: Reaction[];
    contributors: Contributor[];
}

export interface ReleaseRating {
    version: string;
    score: number;
    contributorCount: number;
    reactionCount: number;
    date: string;
}
