import { ReleaseAnalyzer } from './analyzer';
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

// Re-export types for external use
export {
    ReleaseNote,
    ReleaseRating,
    ProjectEvolutionMetrics,
    ContributionOpportunity,
    ProjectMaturityIndicators,
    StrategicInsight,
    CommunityMetrics,
    RepositoryMetrics
};

export interface AnalyzerConfig {
    releases: ReleaseNote[];
    repoName: string;
    repoMetrics: RepositoryMetrics;
}

export interface AnalyzerOutput {
    ratings: ReleaseRating[];
    ratingMarkdown: string;
    featureStoryMarkdown: string;
    evolution: ProjectEvolutionMetrics;
    opportunities: ContributionOpportunity[];
    maturity: ProjectMaturityIndicators;
    insights: StrategicInsight[];
    community: CommunityMetrics;
}

/**
 * Analyzes GitHub releases to provide comprehensive insights about project evolution,
 * contribution opportunities, and community dynamics.
 * 
 * @param config Configuration object containing releases data and repository information
 * @returns Comprehensive analysis results including various metrics and insights
 */
export async function analyzeReleases(config: AnalyzerConfig): Promise<AnalyzerOutput> {
    const analyzer = new ReleaseAnalyzer(
        config.releases,
        config.repoName,
        config.repoMetrics
    );

    const analysis = await analyzer.analyzeComprehensively();

    return {
        ratings: analysis.ratings,
        ratingMarkdown: analyzer.generateRatingMarkdown(),
        featureStoryMarkdown: analyzer.generateMarkdownSummary(),
        evolution: analysis.evolution,
        opportunities: analysis.opportunities,
        maturity: analysis.maturity,
        insights: analysis.insights,
        community: analysis.community
    };
}

/**
 * Generates a markdown summary of release ratings based on community engagement.
 * 
 * @param config Configuration object containing releases data and repository information
 * @returns Markdown string containing the release ratings summary
 */
export function generateRatingMarkdown(config: AnalyzerConfig): string {
    const analyzer = new ReleaseAnalyzer(
        config.releases,
        config.repoName,
        config.repoMetrics
    );
    return analyzer.generateRatingMarkdown();
}

/**
 * Generates a markdown summary of the project's feature evolution story.
 * 
 * @param config Configuration object containing releases data and repository information
 * @returns Markdown string containing the feature evolution story
 */
export function generateFeatureStoryMarkdown(config: AnalyzerConfig): string {
    const analyzer = new ReleaseAnalyzer(
        config.releases,
        config.repoName,
        config.repoMetrics
    );
    return analyzer.generateMarkdownSummary();
}

/**
 * Analyzes project evolution metrics to understand development patterns and trends.
 * 
 * @param config Configuration object containing releases data and repository information
 * @returns Project evolution metrics including velocity and focus areas
 */
export async function analyzeProjectEvolution(config: AnalyzerConfig): Promise<ProjectEvolutionMetrics> {
    const analyzer = new ReleaseAnalyzer(
        config.releases,
        config.repoName,
        config.repoMetrics
    );
    const analysis = await analyzer.analyzeComprehensively();
    return analysis.evolution;
}

/**
 * Identifies potential contribution opportunities based on project gaps and needs.
 * 
 * @param config Configuration object containing releases data and repository information
 * @returns Array of contribution opportunities with priority and complexity ratings
 */
export async function identifyContributionOpportunities(config: AnalyzerConfig): Promise<ContributionOpportunity[]> {
    const analyzer = new ReleaseAnalyzer(
        config.releases,
        config.repoName,
        config.repoMetrics
    );
    const analysis = await analyzer.analyzeComprehensively();
    return analysis.opportunities;
}

/**
 * Analyzes project maturity across various dimensions like stability and documentation.
 * 
 * @param config Configuration object containing releases data and repository information
 * @returns Project maturity indicators across different aspects
 */
export async function analyzeProjectMaturity(config: AnalyzerConfig): Promise<ProjectMaturityIndicators> {
    const analyzer = new ReleaseAnalyzer(
        config.releases,
        config.repoName,
        config.repoMetrics
    );
    const analysis = await analyzer.analyzeComprehensively();
    return analysis.maturity;
}

/**
 * Generates strategic insights based on project evolution and maturity analysis.
 * 
 * @param config Configuration object containing releases data and repository information
 * @returns Array of strategic insights with recommendations
 */
export async function generateStrategicInsights(config: AnalyzerConfig): Promise<StrategicInsight[]> {
    const analyzer = new ReleaseAnalyzer(
        config.releases,
        config.repoName,
        config.repoMetrics
    );
    const analysis = await analyzer.analyzeComprehensively();
    return analysis.insights;
}

/**
 * Analyzes community dynamics and collaboration patterns.
 * 
 * @param config Configuration object containing releases data and repository information
 * @returns Community metrics including demographics and collaboration patterns
 */
export async function analyzeCommunityDynamics(config: AnalyzerConfig): Promise<CommunityMetrics> {
    const analyzer = new ReleaseAnalyzer(
        config.releases,
        config.repoName,
        config.repoMetrics
    );
    const analysis = await analyzer.analyzeComprehensively();
    return analysis.community;
}
