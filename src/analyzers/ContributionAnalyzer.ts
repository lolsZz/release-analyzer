import { 
    ContributionOpportunity, 
    ProjectEvolutionMetrics, 
    ReleaseNote 
} from '../types';

export class ContributionAnalyzer {
    private readonly COMPLEXITY_THRESHOLD = {
        LOW: 3,
        MEDIUM: 6,
        HIGH: 9
    };

    public async identifyOpportunities(
        evolutionMetrics: ProjectEvolutionMetrics,
        recentReleases: ReleaseNote[]
    ): Promise<ContributionOpportunity[]> {
        const opportunities: ContributionOpportunity[] = [];
        
        // Analyze project gaps based on evolution patterns
        const gaps = await this.analyzeProjectGaps(evolutionMetrics);
        
        // Identify areas needing attention
        const focusAreas = await this.identifyUnderservedAreas(recentReleases);
        
        // Generate opportunities based on gaps and focus areas
        opportunities.push(...this.generateOpportunitiesFromGaps(gaps));
        opportunities.push(...this.generateOpportunitiesFromFocusAreas(focusAreas));

        return this.prioritizeOpportunities(opportunities);
    }

    private async analyzeProjectGaps(metrics: ProjectEvolutionMetrics) {
        const gaps: Array<{area: string, severity: number}> = [];

        // Analyze development velocity gaps
        if (metrics.developmentVelocity.releaseFrequency < 1) { // Less than 1 release per month
            gaps.push({
                area: 'Release Management',
                severity: 8
            });
        }

        // Analyze focus areas gaps
        const underservedCategories = metrics.focusAreas
            .filter(area => area.frequency < 2 && area.trend !== 'increasing')
            .map(area => ({
                area: area.category,
                severity: 7
            }));
        gaps.push(...underservedCategories);

        // Analyze community engagement gaps
        if (metrics.communityEngagement.contributorGrowth < 5) { // Less than 5% growth
            gaps.push({
                area: 'Community Growth',
                severity: 9
            });
        }

        return gaps;
    }

    private async identifyUnderservedAreas(releases: ReleaseNote[]) {
        const areas = new Set<string>();
        
        // Analyze release notes for recurring themes or missing elements
        releases.forEach(release => {
            if (!release.body?.includes('documentation')) {
                areas.add('Documentation');
            }
            if (!release.body?.includes('test')) {
                areas.add('Testing');
            }
            if (!release.body?.toLowerCase().includes('performance')) {
                areas.add('Performance');
            }
        });

        return Array.from(areas);
    }

    private generateOpportunitiesFromGaps(gaps: Array<{area: string, severity: number}>): ContributionOpportunity[] {
        return gaps.map(gap => {
            const baseOpportunity = this.createBaseOpportunity(gap.area);
            return {
                ...baseOpportunity,
                priority: gap.severity,
                contextualInsights: `This area shows significant gaps in recent project history and needs attention.`
            };
        });
    }

    private generateOpportunitiesFromFocusAreas(areas: string[]): ContributionOpportunity[] {
        return areas.map(area => {
            const baseOpportunity = this.createBaseOpportunity(area);
            return {
                ...baseOpportunity,
                priority: 5, // Medium priority for focus areas
                contextualInsights: `This area has been identified as underserved in recent releases.`
            };
        });
    }

    private createBaseOpportunity(area: string): ContributionOpportunity {
        const type = this.determineOpportunityType(area);
        const complexity = this.determineComplexity(area);
        const skills = this.determineRequiredSkills(area);

        return {
            type,
            complexity,
            priority: 0, // Will be set by calling function
            relevantSkills: skills,
            relatedIssues: [], // Would be populated from GitHub Issues API
            contextualInsights: ''
        };
    }

    private determineOpportunityType(area: string): ContributionOpportunity['type'] {
        const typeMap: Record<string, ContributionOpportunity['type']> = {
            'Documentation': 'documentation',
            'Testing': 'improvement',
            'Performance': 'improvement',
            'Bug Fixes': 'bugfix',
            'Feature Requests': 'feature'
        };

        return typeMap[area] || 'improvement';
    }

    private determineComplexity(area: string): number {
        const complexityMap: Record<string, number> = {
            'Documentation': this.COMPLEXITY_THRESHOLD.LOW,
            'Testing': this.COMPLEXITY_THRESHOLD.MEDIUM,
            'Performance': this.COMPLEXITY_THRESHOLD.HIGH,
            'Bug Fixes': this.COMPLEXITY_THRESHOLD.MEDIUM,
            'Feature Requests': this.COMPLEXITY_THRESHOLD.HIGH
        };

        return complexityMap[area] || this.COMPLEXITY_THRESHOLD.MEDIUM;
    }

    private determineRequiredSkills(area: string): string[] {
        const skillsMap: Record<string, string[]> = {
            'Documentation': ['Technical Writing', 'Markdown'],
            'Testing': ['Unit Testing', 'Test Frameworks', 'Code Coverage Tools'],
            'Performance': ['Performance Optimization', 'Profiling Tools', 'Algorithms'],
            'Bug Fixes': ['Debugging', 'Problem Solving', 'Code Review'],
            'Feature Requests': ['Software Design', 'Full Stack Development']
        };

        return skillsMap[area] || ['General Development'];
    }

    private prioritizeOpportunities(opportunities: ContributionOpportunity[]): ContributionOpportunity[] {
        return opportunities.sort((a, b) => {
            // Sort by priority first
            if (b.priority !== a.priority) {
                return b.priority - a.priority;
            }
            
            // Then by complexity (prefer lower complexity)
            return a.complexity - b.complexity;
        });
    }
}
