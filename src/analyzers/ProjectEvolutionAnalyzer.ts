import { ReleaseNote, ProjectEvolutionMetrics } from '../types';

export class ProjectEvolutionAnalyzer {
    private releases: ReleaseNote[];
    private readonly ANALYSIS_WINDOW_DAYS = 180; // 6 months window for trend analysis
    
    constructor(releases: ReleaseNote[]) {
        this.releases = releases.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }

    public async analyzeProjectTrajectory(): Promise<ProjectEvolutionMetrics> {
        return {
            developmentVelocity: await this.analyzeDevelopmentVelocity(),
            focusAreas: await this.identifyFocusAreas(),
            communityEngagement: await this.analyzeCommunityMetrics()
        };
    }

    private async analyzeDevelopmentVelocity() {
        const recentReleases = this.getRecentReleases();
        const totalDays = this.ANALYSIS_WINDOW_DAYS;
        
        const releaseFrequency = recentReleases.length / (totalDays / 30); // Releases per month
        
        // Calculate feature velocity by analyzing release bodies
        const featureCount = recentReleases.reduce((count, release) => {
            const features = this.extractFeatures(release.body);
            return count + features.length;
        }, 0);
        const featureVelocity = featureCount / (totalDays / 30); // Features per month

        // Calculate breaking change frequency
        const breakingChanges = recentReleases.reduce((count, release) => {
            const breaking = this.extractBreakingChanges(release.body);
            return count + breaking.length;
        }, 0);
        const breakingChangeFrequency = breakingChanges / (totalDays / 30); // Breaking changes per month

        return {
            releaseFrequency,
            featureVelocity,
            breakingChangeFrequency
        };
    }

    private async identifyFocusAreas() {
        const recentReleases = this.getRecentReleases();
        const categoryFrequency = new Map<string, number>();
        const categoryTrends = new Map<string, number[]>();

        // Analyze each release for feature categories
        recentReleases.forEach(release => {
            const features = this.extractFeatures(release.body);
            const categories = this.categorizeFeaturesAndChanges(features);
            
            categories.forEach(category => {
                categoryFrequency.set(category, (categoryFrequency.get(category) || 0) + 1);
                
                if (!categoryTrends.has(category)) {
                    categoryTrends.set(category, []);
                }
                categoryTrends.get(category)?.push(1);
            });
        });

        // Calculate trends
        return Array.from(categoryFrequency.entries())
            .map(([category, frequency]) => {
                const trend = this.calculateTrend(categoryTrends.get(category) || []);
                return {
                    category,
                    frequency,
                    trend
                };
            })
            .sort((a, b) => b.frequency - a.frequency);
    }

    private async analyzeCommunityMetrics() {
        const recentReleases = this.getRecentReleases();
        
        // Calculate contributor growth
        const uniqueContributors = new Set<string>();
        const contributorsByPeriod: number[] = [];
        
        recentReleases.forEach(release => {
            release.contributors.forEach(contributor => {
                uniqueContributors.add(contributor.login);
            });
            contributorsByPeriod.push(uniqueContributors.size);
        });

        const contributorGrowth = this.calculateGrowthRate(contributorsByPeriod);

        return {
            contributorGrowth,
            issueResolutionTime: 0, // Would require GitHub Issues API data
            prMergeRate: 0 // Would require GitHub PR API data
        };
    }

    private getRecentReleases(): ReleaseNote[] {
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.ANALYSIS_WINDOW_DAYS);
        
        return this.releases.filter(release => 
            new Date(release.createdAt) >= cutoffDate
        );
    }

    private extractFeatures(body: string | null): string[] {
        if (!body) return [];
        
        const features: string[] = [];
        const lines = body.split('\n');
        let inFeaturesSection = false;

        for (const line of lines) {
            if (line.match(/^###?\s+(?:New Features|Features|Major Changes|Improvements)/i)) {
                inFeaturesSection = true;
                continue;
            }

            if (inFeaturesSection && line.match(/^###/)) {
                inFeaturesSection = false;
                continue;
            }

            if (inFeaturesSection && line.match(/^[-*]\s+/)) {
                const feature = line.replace(/^[-*]\s+/, '').trim();
                if (feature.length > 0) {
                    features.push(feature);
                }
            }
        }

        return features;
    }

    private extractBreakingChanges(body: string | null): string[] {
        if (!body) return [];
        
        const changes: string[] = [];
        const lines = body.split('\n');
        let inBreakingSection = false;

        for (const line of lines) {
            if (line.match(/^###?\s+(?:Breaking Changes|BREAKING CHANGES)/i)) {
                inBreakingSection = true;
                continue;
            }

            if (inBreakingSection && line.match(/^###/)) {
                inBreakingSection = false;
                continue;
            }

            if (inBreakingSection && line.match(/^[-*]\s+/)) {
                const change = line.replace(/^[-*]\s+/, '').trim();
                if (change.length > 0) {
                    changes.push(change);
                }
            }
        }

        return changes;
    }

    private categorizeFeaturesAndChanges(features: string[]): string[] {
        const categories = new Set<string>();
        
        const categoryPatterns = [
            { pattern: /api|endpoint|rest|graphql/i, category: 'API' },
            { pattern: /ui|interface|design|css|style/i, category: 'UI/UX' },
            { pattern: /performance|optimize|speed|faster/i, category: 'Performance' },
            { pattern: /security|auth|permission|role/i, category: 'Security' },
            { pattern: /test|coverage|spec|assertion/i, category: 'Testing' },
            { pattern: /doc|readme|guide|tutorial/i, category: 'Documentation' },
            { pattern: /bug|fix|issue|resolve/i, category: 'Bug Fixes' },
            { pattern: /refactor|clean|improve|enhance/i, category: 'Code Quality' }
        ];

        features.forEach(feature => {
            for (const {pattern, category} of categoryPatterns) {
                if (pattern.test(feature)) {
                    categories.add(category);
                }
            }
        });

        return Array.from(categories);
    }

    private calculateTrend(values: number[]): 'increasing' | 'stable' | 'decreasing' {
        if (values.length < 2) return 'stable';
        
        const slope = this.calculateLinearRegression(values);
        
        if (slope > 0.1) return 'increasing';
        if (slope < -0.1) return 'decreasing';
        return 'stable';
    }

    private calculateLinearRegression(values: number[]): number {
        const n = values.length;
        const x = Array.from({length: n}, (_, i) => i);
        
        const sumX = x.reduce((a, b) => a + b, 0);
        const sumY = values.reduce((a, b) => a + b, 0);
        const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0);
        const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0);
        
        return (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    }

    private calculateGrowthRate(values: number[]): number {
        if (values.length < 2) return 0;
        
        const initial = values[0];
        const final = values[values.length - 1];
        const periods = values.length - 1;
        
        return ((final / initial) ** (1 / periods) - 1) * 100;
    }
}
