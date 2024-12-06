# Release Analyzer

A powerful tool for analyzing GitHub releases to understand project evolution patterns, identify contribution opportunities, and gain insights into community dynamics.

## Features

### 1. Project Evolution Analytics
- Track development velocity including release frequency and feature velocity
- Identify focus areas and their trends
- Monitor breaking change frequency
- Analyze community engagement metrics

### 2. Contribution Opportunity Detection
- Automatically identify areas needing attention
- Score opportunities by priority and complexity
- Map required skills for contributions
- Link to related issues and context

### 3. Project Maturity Analysis
- Assess codebase stability
- Track documentation completeness
- Monitor test coverage
- Evaluate community health
- Gauge maintenance levels

### 4. Strategic Insight Generation
- Recognize development patterns
- Identify growth opportunities
- Generate actionable recommendations
- Support decisions with data

### 5. Community Analytics
- Analyze contributor demographics
- Detect collaboration patterns
- Track knowledge sharing
- Identify mentorship relationships

## Installation

```bash
npm install release-analyzer
```

## Usage

### Basic Analysis

```typescript
import { analyzeReleases, AnalyzerConfig } from 'release-analyzer';

const config: AnalyzerConfig = {
    releases: [], // Your release data here
    repoName: "your-repo",
    repoMetrics: {
        codeQuality: {
            testCoverage: 0.85,
            documentationRatio: 0.75
        },
        activityMetrics: {
            commitFrequency: 8.5,
            issueVelocity: 6.2
        }
    }
};

const analysis = await analyzeReleases(config);
console.log(analysis.evolution);  // Project evolution metrics
console.log(analysis.opportunities);  // Contribution opportunities
console.log(analysis.insights);  // Strategic insights
```

### Focused Analysis

You can also use specific analyzers for targeted insights:

```typescript
import { 
    analyzeProjectEvolution,
    identifyContributionOpportunities,
    analyzeProjectMaturity,
    generateStrategicInsights,
    analyzeCommunityDynamics
} from 'release-analyzer';

// Analyze project evolution
const evolution = await analyzeProjectEvolution(config);

// Find contribution opportunities
const opportunities = await identifyContributionOpportunities(config);

// Assess project maturity
const maturity = await analyzeProjectMaturity(config);

// Generate strategic insights
const insights = await generateStrategicInsights(config);

// Analyze community dynamics
const community = await analyzeCommunityDynamics(config);
```

### Generate Reports

```typescript
import { 
    generateRatingMarkdown,
    generateFeatureStoryMarkdown
} from 'release-analyzer';

// Generate release ratings report
const ratings = generateRatingMarkdown(config);

// Generate feature evolution story
const story = generateFeatureStoryMarkdown(config);
```

## API Reference

### analyzeReleases(config: AnalyzerConfig): Promise<AnalyzerOutput>

Performs comprehensive analysis of releases, returning:
- Release ratings
- Feature evolution story
- Project evolution metrics
- Contribution opportunities
- Project maturity indicators
- Strategic insights
- Community metrics

### analyzeProjectEvolution(config: AnalyzerConfig): Promise<ProjectEvolutionMetrics>

Analyzes project evolution patterns, including:
- Development velocity
- Focus areas
- Community engagement

### identifyContributionOpportunities(config: AnalyzerConfig): Promise<ContributionOpportunity[]>

Identifies potential contribution areas, providing:
- Type of contribution needed
- Priority level
- Complexity assessment
- Required skills
- Related issues
- Contextual insights

### analyzeProjectMaturity(config: AnalyzerConfig): Promise<ProjectMaturityIndicators>

Assesses project maturity across:
- Codebase stability
- Documentation completeness
- Test coverage
- Community health
- Maintenance level

### generateStrategicInsights(config: AnalyzerConfig): Promise<StrategicInsight[]>

Generates strategic insights including:
- Key observations
- Impact assessment
- Recommended actions
- Supporting data

### analyzeCommunityDynamics(config: AnalyzerConfig): Promise<CommunityMetrics>

Analyzes community patterns including:
- Contributor demographics
- Expertise distribution
- Activity patterns
- Collaboration dynamics
- Knowledge sharing indicators

## Types

### AnalyzerConfig
```typescript
interface AnalyzerConfig {
    releases: ReleaseNote[];
    repoName: string;
    repoMetrics: RepositoryMetrics;
}
```

### AnalyzerOutput
```typescript
interface AnalyzerOutput {
    ratings: ReleaseRating[];
    ratingMarkdown: string;
    featureStoryMarkdown: string;
    evolution: ProjectEvolutionMetrics;
    opportunities: ContributionOpportunity[];
    maturity: ProjectMaturityIndicators;
    insights: StrategicInsight[];
    community: CommunityMetrics;
}
```

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
