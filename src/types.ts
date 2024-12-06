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

export interface ProjectEvolutionMetrics {
    developmentVelocity: {
        releaseFrequency: number;
        featureVelocity: number;
        breakingChangeFrequency: number;
    };
    focusAreas: {
        category: string;
        frequency: number;
        trend: 'increasing' | 'stable' | 'decreasing';
    }[];
    communityEngagement: {
        contributorGrowth: number;
        issueResolutionTime: number;
        prMergeRate: number;
    };
}

export interface ContributionOpportunity {
    type: 'feature' | 'improvement' | 'bugfix' | 'documentation';
    priority: number;
    complexity: number;
    relevantSkills: string[];
    relatedIssues: string[];
    contextualInsights: string;
}

export interface ProjectMaturityIndicators {
    codebaseStability: number;
    documentationCompleteness: number;
    testCoverage: number;
    communityHealth: number;
    maintenanceLevel: number;
}

export interface StrategicInsight {
    observation: string;
    impact: string;
    recommendedActions: string[];
    supportingData: any;
}

export interface CommunityMetrics {
    contributorDemographics: {
        experienceLevel: Map<string, number>;
        expertiseAreas: Map<string, string[]>;
        activityPatterns: Map<string, number>;
    };
    collaborationPatterns: {
        mentorship: Map<string, string[]>;
        codeReviewDynamics: Map<string, number>;
        knowledgeSharing: string[];
    };
}

export interface RepositoryMetrics {
    codeQuality: {
        testCoverage: number;
        documentationRatio: number;
    };
    activityMetrics: {
        commitFrequency: number;
        issueVelocity: number;
    };
}
