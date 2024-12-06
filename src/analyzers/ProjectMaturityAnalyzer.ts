import { 
    ProjectMaturityIndicators, 
    ReleaseNote, 
    RepositoryMetrics 
} from '../types';

export class ProjectMaturityAnalyzer {
    private releases: ReleaseNote[];
    private repoMetrics: RepositoryMetrics;

    constructor(releases: ReleaseNote[], repoMetrics: RepositoryMetrics) {
        this.releases = releases.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.repoMetrics = repoMetrics;
    }

    public async analyzeMaturity(): Promise<ProjectMaturityIndicators> {
        return {
            codebaseStability: this.assessCodebaseStability(),
            documentationCompleteness: this.assessDocumentation(),
            testCoverage: this.assessTestCoverage(),
            communityHealth: this.assessCommunityHealth(),
            maintenanceLevel: this.assessMaintenance()
        };
    }

    private assessCodebaseStability(): number {
        const recentReleases = this.getRecentReleases();
        let stabilityScore = 0;
        
        // Factor 1: Breaking changes frequency (30% weight)
        const breakingChangesCount = recentReleases.reduce((count, release) => {
            return count + this.countBreakingChanges(release.body);
        }, 0);
        const breakingChangesScore = Math.max(0, 10 - breakingChangesCount) * 3;
        
        // Factor 2: Bug fix frequency (30% weight)
        const bugFixCount = recentReleases.reduce((count, release) => {
            return count + this.countBugFixes(release.body);
        }, 0);
        const bugFixScore = Math.max(0, 10 - bugFixCount) * 3;
        
        // Factor 3: Release consistency (40% weight)
        const releaseConsistencyScore = this.calculateReleaseConsistency() * 4;
        
        stabilityScore = breakingChangesScore + bugFixScore + releaseConsistencyScore;
        return Math.min(100, stabilityScore) / 100;
    }

    private assessDocumentation(): number {
        // Factor 1: Documentation coverage (50% weight)
        const docCoverageScore = this.repoMetrics.codeQuality.documentationRatio * 50;
        
        // Factor 2: Documentation updates frequency (30% weight)
        const docUpdateScore = this.calculateDocumentationUpdateFrequency() * 30;
        
        // Factor 3: Documentation quality (20% weight)
        const docQualityScore = this.assessDocumentationQuality() * 20;
        
        return (docCoverageScore + docUpdateScore + docQualityScore) / 100;
    }

    private assessTestCoverage(): number {
        // Direct mapping from repository metrics
        return this.repoMetrics.codeQuality.testCoverage;
    }

    private assessCommunityHealth(): number {
        let healthScore = 0;
        
        // Factor 1: Contributor diversity (40% weight)
        const contributorScore = this.calculateContributorDiversity() * 40;
        
        // Factor 2: Activity level (30% weight)
        const activityScore = this.calculateActivityLevel() * 30;
        
        // Factor 3: Community responsiveness (30% weight)
        const responsivenessScore = this.calculateResponsiveness() * 30;
        
        healthScore = contributorScore + activityScore + responsivenessScore;
        return healthScore / 100;
    }

    private assessMaintenance(): number {
        let maintenanceScore = 0;
        
        // Factor 1: Release frequency (40% weight)
        const releaseScore = this.calculateReleaseFrequency() * 40;
        
        // Factor 2: Issue resolution rate (30% weight)
        const issueScore = (this.repoMetrics.activityMetrics.issueVelocity / 10) * 30;
        
        // Factor 3: Commit frequency (30% weight)
        const commitScore = (this.repoMetrics.activityMetrics.commitFrequency / 10) * 30;
        
        maintenanceScore = releaseScore + issueScore + commitScore;
        return maintenanceScore / 100;
    }

    private getRecentReleases(months: number = 6): ReleaseNote[] {
        const cutoffDate = new Date();
        cutoffDate.setMonth(cutoffDate.getMonth() - months);
        
        return this.releases.filter(release => 
            new Date(release.createdAt) >= cutoffDate
        );
    }

    private countBreakingChanges(body: string | null): number {
        if (!body) return 0;
        
        const breakingChangesMatch = body.match(/breaking change/gi);
        return breakingChangesMatch ? breakingChangesMatch.length : 0;
    }

    private countBugFixes(body: string | null): number {
        if (!body) return 0;
        
        const bugFixMatch = body.match(/fix|bug|issue|resolve/gi);
        return bugFixMatch ? bugFixMatch.length : 0;
    }

    private calculateReleaseConsistency(): number {
        const recentReleases = this.getRecentReleases();
        if (recentReleases.length < 2) return 0;

        const intervals: number[] = [];
        for (let i = 1; i < recentReleases.length; i++) {
            const current = new Date(recentReleases[i].createdAt);
            const previous = new Date(recentReleases[i-1].createdAt);
            intervals.push(Math.abs(current.getTime() - previous.getTime()));
        }

        // Calculate coefficient of variation (lower is more consistent)
        const mean = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const variance = intervals.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / intervals.length;
        const stdDev = Math.sqrt(variance);
        const cv = stdDev / mean;

        // Convert to a 0-1 score (lower CV means higher consistency)
        return Math.max(0, 1 - cv);
    }

    private calculateDocumentationUpdateFrequency(): number {
        const recentReleases = this.getRecentReleases();
        const docUpdateCount = recentReleases.reduce((count, release) => {
            return count + (release.body?.toLowerCase().includes('doc') ? 1 : 0);
        }, 0);
        
        return Math.min(1, docUpdateCount / recentReleases.length);
    }

    private assessDocumentationQuality(): number {
        const recentReleases = this.getRecentReleases(3); // Look at last 3 months
        let qualityScore = 0;
        
        recentReleases.forEach(release => {
            if (!release.body) return;
            
            // Check for structured documentation
            if (release.body.includes('##')) qualityScore += 0.2;
            if (release.body.includes('example')) qualityScore += 0.2;
            if (release.body.includes('usage')) qualityScore += 0.2;
            if (release.body.includes('migration')) qualityScore += 0.2;
            if (release.body.includes('guide')) qualityScore += 0.2;
        });
        
        return Math.min(1, qualityScore);
    }

    private calculateContributorDiversity(): number {
        const uniqueContributors = new Set<string>();
        const contributionCounts = new Map<string, number>();
        
        this.releases.forEach(release => {
            release.contributors.forEach(contributor => {
                uniqueContributors.add(contributor.login);
                contributionCounts.set(
                    contributor.login,
                    (contributionCounts.get(contributor.login) || 0) + 1
                );
            });
        });
        
        // Calculate Gini coefficient for contribution distribution
        const values = Array.from(contributionCounts.values()).sort((a, b) => a - b);
        const n = values.length;
        if (n === 0) return 0;
        
        const mean = values.reduce((a, b) => a + b, 0) / n;
        const totalDiff = values.reduce((sum, val) => {
            return sum + values.reduce((innerSum, innerVal) => {
                return innerSum + Math.abs(val - innerVal);
            }, 0);
        }, 0);
        
        const gini = totalDiff / (2 * n * n * mean);
        
        // Convert Gini to diversity score (1 - gini, as lower Gini means higher diversity)
        return 1 - gini;
    }

    private calculateActivityLevel(): number {
        const recentReleases = this.getRecentReleases(3); // Last 3 months
        const activityScore = Math.min(1, recentReleases.length / 6); // Expect 2 releases per month
        
        return activityScore;
    }

    private calculateResponsiveness(): number {
        // Using commit frequency as a proxy for responsiveness
        return Math.min(1, this.repoMetrics.activityMetrics.commitFrequency / 10);
    }

    private calculateReleaseFrequency(): number {
        const recentReleases = this.getRecentReleases(6); // Last 6 months
        return Math.min(1, recentReleases.length / 12); // Expect 2 releases per month
    }
}
