import { 
    CommunityMetrics,
    ReleaseNote,
    Contributor 
} from '../types';

type ExperienceLevel = 'novice' | 'intermediate' | 'expert';

export class CommunityAnalyzer {
    private readonly EXPERIENCE_LEVELS: Record<string, ExperienceLevel> = {
        NOVICE: 'novice',
        INTERMEDIATE: 'intermediate',
        EXPERT: 'expert'
    };

    private readonly EXPERTISE_CATEGORIES = [
        'Documentation',
        'Testing',
        'Frontend',
        'Backend',
        'DevOps',
        'Security',
        'Performance'
    ];

    public async analyzeCommunityDynamics(
        releases: ReleaseNote[],
        contributors: Contributor[]
    ): Promise<CommunityMetrics> {
        return {
            contributorDemographics: await this.analyzeContributors(contributors, releases),
            collaborationPatterns: await this.analyzeCollaboration(releases, contributors)
        };
    }

    private async analyzeContributors(
        contributors: Contributor[],
        releases: ReleaseNote[]
    ): Promise<CommunityMetrics['contributorDemographics']> {
        // Analyze experience levels based on contribution history
        const experienceLevel = this.analyzeExperienceLevels(contributors, releases);
        
        // Identify expertise areas based on contribution patterns
        const expertiseAreas = this.identifyExpertiseAreas(contributors, releases);
        
        // Analyze activity patterns
        const activityPatterns = this.analyzeActivityPatterns(contributors, releases);

        return {
            experienceLevel,
            expertiseAreas,
            activityPatterns
        };
    }

    private analyzeExperienceLevels(
        contributors: Contributor[],
        releases: ReleaseNote[]
    ): Map<string, number> {
        const experienceLevels = new Map<string, number>();
        const contributionHistory = new Map<string, Set<string>>();

        // Build contribution history
        releases.forEach(release => {
            release.contributors.forEach(contributor => {
                if (!contributionHistory.has(contributor.login)) {
                    contributionHistory.set(contributor.login, new Set());
                }
                contributionHistory.get(contributor.login)?.add(release.tagName);
            });
        });

        // Categorize contributors by experience
        contributors.forEach(contributor => {
            const releaseCount = contributionHistory.get(contributor.login)?.size || 0;
            const contributionCount = contributor.contributions;

            let level: ExperienceLevel = this.EXPERIENCE_LEVELS.NOVICE;
            if (releaseCount > 10 || contributionCount > 50) {
                level = this.EXPERIENCE_LEVELS.EXPERT;
            } else if (releaseCount > 3 || contributionCount > 10) {
                level = this.EXPERIENCE_LEVELS.INTERMEDIATE;
            }

            experienceLevels.set(level, (experienceLevels.get(level) || 0) + 1);
        });

        return experienceLevels;
    }

    private identifyExpertiseAreas(
        contributors: Contributor[],
        releases: ReleaseNote[]
    ): Map<string, string[]> {
        const expertiseMap = new Map<string, string[]>();
        const contributionPatterns = new Map<string, Map<string, number>>();

        // Analyze release notes for contribution patterns
        releases.forEach(release => {
            if (!release.body) return;

            this.EXPERTISE_CATEGORIES.forEach(category => {
                const pattern = new RegExp(category, 'i');
                if (release.body && pattern.test(release.body)) {
                    release.contributors.forEach(contributor => {
                        if (!contributionPatterns.has(contributor.login)) {
                            contributionPatterns.set(contributor.login, new Map());
                        }
                        const categoryCount = contributionPatterns.get(contributor.login);
                        if (categoryCount) {
                            categoryCount.set(
                                category,
                                (categoryCount.get(category) || 0) + 1
                            );
                        }
                    });
                }
            });
        });

        // Determine primary expertise areas for each contributor
        contributors.forEach(contributor => {
            const categoryCount = contributionPatterns.get(contributor.login);
            if (!categoryCount) return;

            const expertise = Array.from(categoryCount.entries())
                .filter(([_, count]) => count >= 2) // Minimum threshold for expertise
                .sort((a, b) => b[1] - a[1])
                .slice(0, 3) // Top 3 areas
                .map(([category]) => category);

            if (expertise.length > 0) {
                expertiseMap.set(contributor.login, expertise);
            }
        });

        return expertiseMap;
    }

    private analyzeActivityPatterns(
        contributors: Contributor[],
        releases: ReleaseNote[]
    ): Map<string, number> {
        const activityPatterns = new Map<string, number>();
        const releaseTimestamps = new Map<string, Map<string, Date>>();

        // Build activity timeline
        releases.forEach(release => {
            release.contributors.forEach(contributor => {
                if (!releaseTimestamps.has(contributor.login)) {
                    releaseTimestamps.set(contributor.login, new Map());
                }
                releaseTimestamps.get(contributor.login)?.set(
                    release.tagName,
                    new Date(release.createdAt)
                );
            });
        });

        // Analyze contribution frequency and patterns
        contributors.forEach(contributor => {
            const timestamps = releaseTimestamps.get(contributor.login);
            if (!timestamps || timestamps.size < 2) {
                activityPatterns.set(contributor.login, 0);
                return;
            }

            const dates = Array.from(timestamps.values()).sort((a, b) => a.getTime() - b.getTime());
            const intervals: number[] = [];

            for (let i = 1; i < dates.length; i++) {
                intervals.push(dates[i].getTime() - dates[i-1].getTime());
            }

            // Calculate average interval between contributions
            const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const normalizedActivity = Math.min(1, 1 / (avgInterval / (1000 * 60 * 60 * 24 * 30))); // Normalize to monthly activity

            activityPatterns.set(contributor.login, normalizedActivity);
        });

        return activityPatterns;
    }

    private async analyzeCollaboration(
        releases: ReleaseNote[],
        contributors: Contributor[]
    ): Promise<CommunityMetrics['collaborationPatterns']> {
        return {
            mentorship: this.identifyMentorshipPatterns(releases, contributors),
            codeReviewDynamics: this.analyzeCodeReviewPatterns(releases),
            knowledgeSharing: this.identifyKnowledgeSharingPatterns(releases)
        };
    }

    private identifyMentorshipPatterns(
        releases: ReleaseNote[],
        contributors: Contributor[]
    ): Map<string, string[]> {
        const mentorship = new Map<string, string[]>();
        const experienceLevels = new Map<string, ExperienceLevel>();

        // Pre-calculate experience levels for each contributor
        contributors.forEach(contributor => {
            const releaseCount = releases.filter(r => 
                r.contributors.some(c => c.login === contributor.login)
            ).length;

            let level: ExperienceLevel;
            if (releaseCount > 10 || contributor.contributions > 50) {
                level = this.EXPERIENCE_LEVELS.EXPERT;
            } else if (releaseCount > 3 || contributor.contributions > 10) {
                level = this.EXPERIENCE_LEVELS.INTERMEDIATE;
            } else {
                level = this.EXPERIENCE_LEVELS.NOVICE;
            }
            experienceLevels.set(contributor.login, level);
        });

        // Analyze collaboration patterns in releases
        releases.forEach(release => {
            const expertContributors = release.contributors.filter(c => 
                experienceLevels.get(c.login) === this.EXPERIENCE_LEVELS.EXPERT
            );
            const noviceContributors = release.contributors.filter(c =>
                experienceLevels.get(c.login) === this.EXPERIENCE_LEVELS.NOVICE
            );

            // Match experts with novices based on collaboration
            expertContributors.forEach(expert => {
                if (!mentorship.has(expert.login)) {
                    mentorship.set(expert.login, []);
                }
                noviceContributors.forEach(novice => {
                    const mentees = mentorship.get(expert.login);
                    if (mentees && !mentees.includes(novice.login)) {
                        mentees.push(novice.login);
                    }
                });
            });
        });

        return mentorship;
    }

    private analyzeCodeReviewPatterns(releases: ReleaseNote[]): Map<string, number> {
        const reviewPatterns = new Map<string, number>();

        // Analyze release notes for review-related activities
        releases.forEach(release => {
            if (!release.body) return;

            const reviewIndicators = [
                'review',
                'approved',
                'feedback',
                'suggestion',
                'comment'
            ];

            release.contributors.forEach(contributor => {
                const currentScore = reviewPatterns.get(contributor.login) || 0;
                const reviewMentions = reviewIndicators.reduce((count, indicator) => {
                    const pattern = new RegExp(indicator, 'gi');
                    const matches = release.body?.match(pattern) || [];
                    return count + matches.length;
                }, 0);

                reviewPatterns.set(
                    contributor.login,
                    currentScore + (reviewMentions > 0 ? 1 : 0)
                );
            });
        });

        return reviewPatterns;
    }

    private identifyKnowledgeSharingPatterns(releases: ReleaseNote[]): string[] {
        const knowledgeSharingIndicators = new Set<string>();

        // Look for knowledge sharing activities in release notes
        releases.forEach(release => {
            if (!release.body) return;

            const patterns = [
                { pattern: /documentation added|docs added/i, type: 'Documentation Contribution' },
                { pattern: /tutorial|guide|how-to/i, type: 'Educational Content' },
                { pattern: /example|sample|demo/i, type: 'Code Examples' },
                { pattern: /wiki|knowledge base/i, type: 'Knowledge Base' },
                { pattern: /workshop|presentation/i, type: 'Community Education' }
            ];

            patterns.forEach(({ pattern, type }) => {
                if (pattern.test(release.body!)) {
                    knowledgeSharingIndicators.add(type);
                }
            });
        });

        return Array.from(knowledgeSharingIndicators);
    }
}
