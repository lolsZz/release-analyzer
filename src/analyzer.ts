import { 
    ReleaseNote, 
    ReleaseRating, 
    ProjectEvolutionMetrics,
    ContributionOpportunity,
    ProjectMaturityIndicators,
    StrategicInsight,
    CommunityMetrics,
    RepositoryMetrics
} from './types';

import { ProjectEvolutionAnalyzer } from './analyzers/ProjectEvolutionAnalyzer';
import { ContributionAnalyzer } from './analyzers/ContributionAnalyzer';
import { ProjectMaturityAnalyzer } from './analyzers/ProjectMaturityAnalyzer';
import { StrategicAnalyzer } from './analyzers/StrategicAnalyzer';
import { CommunityAnalyzer } from './analyzers/CommunityAnalyzer';

interface FeatureStory {
    version: string;
    date: string;
    majorFeatures: string[];
    breakingChanges: string[];
    deprecations: string[];
}

interface ComprehensiveAnalysis {
    ratings: ReleaseRating[];
    featureStory: FeatureStory[];
    evolution: ProjectEvolutionMetrics;
    opportunities: ContributionOpportunity[];
    maturity: ProjectMaturityIndicators;
    insights: StrategicInsight[];
    community: CommunityMetrics;
}

export class ReleaseAnalyzer {
    private releases: ReleaseNote[];
    private repoName: string;
    private repoMetrics: RepositoryMetrics;

    constructor(
        releases: ReleaseNote[], 
        repoName: string,
        repoMetrics: RepositoryMetrics
    ) {
        this.releases = releases.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        this.repoName = repoName;
        this.repoMetrics = repoMetrics;
    }

    public async analyzeComprehensively(): Promise<ComprehensiveAnalysis> {
        // Initialize specialized analyzers
        const evolutionAnalyzer = new ProjectEvolutionAnalyzer(this.releases);
        const maturityAnalyzer = new ProjectMaturityAnalyzer(this.releases, this.repoMetrics);
        const contributionAnalyzer = new ContributionAnalyzer();
        const strategicAnalyzer = new StrategicAnalyzer();
        const communityAnalyzer = new CommunityAnalyzer();

        // Perform comprehensive analysis
        const evolution = await evolutionAnalyzer.analyzeProjectTrajectory();
        const maturity = await maturityAnalyzer.analyzeMaturity();
        const opportunities = await contributionAnalyzer.identifyOpportunities(evolution, this.releases);
        const insights = await strategicAnalyzer.generateInsights(evolution, maturity);
        const community = await communityAnalyzer.analyzeCommunityDynamics(
            this.releases,
            this.releases.flatMap(r => r.contributors)
        );

        return {
            ratings: this.calculateReleaseRatings(),
            featureStory: this.generateFeatureStory(),
            evolution,
            opportunities,
            maturity,
            insights,
            community
        };
    }

    public calculateReleaseRatings(): ReleaseRating[] {
        const ratings: ReleaseRating[] = [];

        for (const release of this.releases) {
            // Calculate total reactions
            const reactionCount = release.reactions.reduce((sum, reaction) => sum + reaction.totalCount, 0);
            
            // Get unique contributor count
            const contributorCount = release.contributors.length;
            
            // Calculate score: 
            // - Each contributor adds 10 points
            // - Each reaction adds 5 points
            const score = (contributorCount * 10) + (reactionCount * 5);

            ratings.push({
                version: this.extractVersion(release.tagName),
                score,
                contributorCount,
                reactionCount,
                date: new Date(release.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                })
            });
        }

        // Sort by score in descending order
        return ratings.sort((a, b) => b.score - a.score);
    }

    public generateRatingMarkdown(): string {
        const ratings = this.calculateReleaseRatings();
        let markdown = `# ${this.repoName} Release Ratings\n\n`;
        
        markdown += `This document presents release ratings based on community engagement metrics (contributors and reactions).\n\n`;
        markdown += `## Rating Methodology\n`;
        markdown += `- Each contributor adds 10 points to the release score\n`;
        markdown += `- Each reaction adds 5 points to the release score\n\n`;
        markdown += `## Release Ratings\n\n`;

        for (const rating of ratings) {
            markdown += `### Version ${rating.version} (${rating.date})\n`;
            markdown += `- Overall Score: ${rating.score}\n`;
            markdown += `- Contributors: ${rating.contributorCount}\n`;
            markdown += `- Reactions: ${rating.reactionCount}\n\n`;
        }

        return markdown;
    }

    public generateFeatureStory(): FeatureStory[] {
        const stories: FeatureStory[] = [];
        const versionMap = new Map<string, ReleaseNote>();

        // Group releases by version, keeping only the latest release for each version
        for (const release of this.releases) {
            const version = this.extractVersion(release.tagName);
            if (!versionMap.has(version) || 
                new Date(release.createdAt) > new Date(versionMap.get(version)!.createdAt)) {
                versionMap.set(version, release);
            }
        }

        // Generate stories for each version
        for (const [version, release] of versionMap) {
            const features = [
                ...this.extractFeatures(release.body),
                ...this.extractPlusChanges(release.body)
            ];
            const breakingChanges = this.extractBreakingChanges(release.body);
            const deprecations = this.extractDeprecations(release.body);

            stories.push({
                version: version,
                date: new Date(release.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                }),
                majorFeatures: features,
                breakingChanges: breakingChanges,
                deprecations: deprecations
            });
        }

        // Sort stories by version number in descending order
        return stories.sort((a, b) => {
            const versionA = a.version.split('.').map(Number);
            const versionB = b.version.split('.').map(Number);
            
            for (let i = 0; i < Math.max(versionA.length, versionB.length); i++) {
                const numA = versionA[i] || 0;
                const numB = versionB[i] || 0;
                if (numA !== numB) {
                    return numB - numA;
                }
            }
            return 0;
        });
    }

    public generateMarkdownSummary(): string {
        const stories = this.generateFeatureStory();
        let markdown = `# ${this.repoName} Evolution: A Feature Story\n\n`;
        
        markdown += `This document presents a chronological story of ${this.repoName}'s evolution, highlighting major features, breaking changes, and deprecations across versions.\n\n`;

        for (const story of stories) {
            markdown += `## Version ${story.version} (${story.date})\n\n`;

            if (story.majorFeatures.length > 0) {
                markdown += '### Major Features & Improvements\n';
                story.majorFeatures.forEach(feature => {
                    markdown += `- ${feature}\n`;
                });
                markdown += '\n';
            }

            if (story.breakingChanges.length > 0) {
                markdown += '### Breaking Changes\n';
                story.breakingChanges.forEach(change => {
                    markdown += `- ${change}\n`;
                });
                markdown += '\n';
            }

            if (story.deprecations.length > 0) {
                markdown += '### Deprecations & Removals\n';
                story.deprecations.forEach(deprecation => {
                    markdown += `- ${deprecation}\n`;
                });
                markdown += '\n';
            }

            if (story.majorFeatures.length === 0 && 
                story.breakingChanges.length === 0 && 
                story.deprecations.length === 0) {
                markdown += '*No major changes documented for this version.*\n\n';
            }
        }

        return markdown;
    }

    private extractVersion(tagName: string): string {
        // Handle various version formats:
        // v1.0.0, 1.0.0, v1.0, 1.0, v1, 1
        const match = tagName.match(/v?(\d+(?:\.\d+)?(?:\.\d+)?)/);
        return match ? match[1] : tagName;
    }

    private cleanBulletPoint(text: string): string {
        return text
            .replace(/^\s*[-*]\s*/, '') // Remove bullet point
            .replace(/\s+/g, ' ')       // Normalize whitespace
            .trim();
    }

    private extractFeatures(body: string | null): string[] {
        if (!body) return [];
        
        const features: string[] = [];
        const lines = body.split('\n');
        let inFeaturesSection = false;

        for (const line of lines) {
            // Look for feature indicators
            if (line.match(/^###?\s+(?:New Features|Features|Major Changes|Improvements|Enhancements|Changes|Plus|Added)/i) ||
                line.match(/^[-*]\s+(?:New Features|Features|Major Changes|Improvements|Enhancements|Changes|Plus|Added)/i)) {
                inFeaturesSection = true;
                continue;
            }

            // Exit feature section if we hit another heading
            if (line.match(/^###?\s+(?:Breaking Changes|Deprecations|Bug Fixes|Removed|Fixed)/i)) {
                inFeaturesSection = false;
                continue;
            }

            if (inFeaturesSection && line.match(/^[-*]\s+/)) {
                const feature = this.cleanBulletPoint(line);
                
                // Skip if it's just a link, bug fix, or deprecation
                if (!feature.toLowerCase().includes('bugfix') && 
                    !feature.toLowerCase().includes('fix bug') &&
                    !feature.toLowerCase().includes('fixed bug') &&
                    !feature.startsWith('http') &&
                    !feature.toLowerCase().includes('deprecated') &&
                    !feature.toLowerCase().includes('removed') &&
                    feature.length > 0) {
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
            if (line.match(/^###?\s+(?:Breaking Changes|BREAKING CHANGES|Breaking|Important Changes)/i)) {
                inBreakingSection = true;
                continue;
            }

            if (inBreakingSection && line.match(/^###/)) {
                inBreakingSection = false;
                continue;
            }

            if (inBreakingSection && line.match(/^[-*]\s+/)) {
                const change = this.cleanBulletPoint(line);
                if (change.length > 0) {
                    changes.push(change);
                }
            }
        }

        return changes;
    }

    private extractDeprecations(body: string | null): string[] {
        if (!body) return [];
        
        const deprecations: string[] = [];
        const lines = body.split('\n');
        let inDeprecationsSection = false;

        for (const line of lines) {
            if (line.match(/^###?\s+(?:Deprecations|Removed|Deprecated)/i) ||
                line.match(/^[-*]\s+(?:Deprecations|Removed|Deprecated)/i)) {
                inDeprecationsSection = true;
                continue;
            }

            if (inDeprecationsSection && line.match(/^###/)) {
                inDeprecationsSection = false;
                continue;
            }

            if (inDeprecationsSection && line.match(/^[-*]\s+/)) {
                const deprecation = this.cleanBulletPoint(line);
                if (deprecation.length > 0) {
                    deprecations.push(deprecation);
                }
            }
        }

        return deprecations;
    }

    private extractPlusChanges(body: string | null): string[] {
        if (!body) return [];
        
        const changes: string[] = [];
        const lines = body.split('\n');
        let inPlusSection = false;

        for (const line of lines) {
            if (line.match(/^Plus\s+(?:changes|everything|features)/i)) {
                inPlusSection = true;
                continue;
            }

            if (inPlusSection && line.match(/^##/)) {
                inPlusSection = false;
                continue;
            }

            if (inPlusSection && line.match(/^[-*]\s+/)) {
                const change = this.cleanBulletPoint(line);
                if (change.length > 0) {
                    changes.push(change);
                }
            }
        }

        return changes;
    }
}
