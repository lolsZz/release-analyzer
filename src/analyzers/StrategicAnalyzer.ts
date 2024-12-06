import { 
    StrategicInsight, 
    ProjectEvolutionMetrics, 
    ProjectMaturityIndicators 
} from '../types';

export class StrategicAnalyzer {
    public async generateInsights(
        evolutionMetrics: ProjectEvolutionMetrics,
        maturityIndicators: ProjectMaturityIndicators
    ): Promise<StrategicInsight[]> {
        const insights: StrategicInsight[] = [];
        
        // Analyze development patterns
        insights.push(...this.analyzeDevelopmentPatterns(evolutionMetrics));
        
        // Identify growth opportunities
        insights.push(...this.identifyGrowthOpportunities(maturityIndicators));
        
        // Generate contribution strategies
        insights.push(...this.generateContributionStrategies(
            evolutionMetrics,
            maturityIndicators
        ));
        
        return this.prioritizeInsights(insights);
    }

    private analyzeDevelopmentPatterns(metrics: ProjectEvolutionMetrics): StrategicInsight[] {
        const insights: StrategicInsight[] = [];

        // Analyze release velocity
        if (metrics.developmentVelocity.releaseFrequency < 1) {
            insights.push({
                observation: "Low release frequency detected",
                impact: "May indicate development bottlenecks or integration challenges",
                recommendedActions: [
                    "Consider implementing automated release processes",
                    "Break down large changes into smaller, more manageable releases",
                    "Establish regular release schedule with smaller increments"
                ],
                supportingData: {
                    currentFrequency: metrics.developmentVelocity.releaseFrequency,
                    recommendedMinimum: 1
                }
            });
        }

        // Analyze feature development patterns
        const featureVelocityInsight = this.analyzeFeatureVelocity(metrics);
        if (featureVelocityInsight) {
            insights.push(featureVelocityInsight);
        }

        // Analyze breaking changes
        if (metrics.developmentVelocity.breakingChangeFrequency > 0.5) {
            insights.push({
                observation: "High frequency of breaking changes",
                impact: "May discourage adoption and create upgrade barriers for users",
                recommendedActions: [
                    "Implement more comprehensive API versioning",
                    "Provide better migration guides and tools",
                    "Consider longer deprecation cycles"
                ],
                supportingData: {
                    breakingChangeFrequency: metrics.developmentVelocity.breakingChangeFrequency,
                    threshold: 0.5
                }
            });
        }

        // Analyze focus areas
        insights.push(...this.analyzeFocusAreas(metrics.focusAreas));

        return insights;
    }

    private analyzeFeatureVelocity(metrics: ProjectEvolutionMetrics): StrategicInsight | null {
        const { featureVelocity } = metrics.developmentVelocity;
        
        if (featureVelocity < 2) {
            return {
                observation: "Low feature development velocity",
                impact: "Project may be losing momentum or facing resource constraints",
                recommendedActions: [
                    "Review and streamline feature development process",
                    "Consider increasing community engagement for feature contributions",
                    "Evaluate resource allocation and priorities"
                ],
                supportingData: {
                    currentVelocity: featureVelocity,
                    recommendedMinimum: 2
                }
            };
        }
        
        if (featureVelocity > 10) {
            return {
                observation: "Very high feature velocity",
                impact: "Rapid development may impact stability and maintenance",
                recommendedActions: [
                    "Ensure adequate testing coverage for new features",
                    "Balance feature development with stability improvements",
                    "Consider impact on documentation and maintenance"
                ],
                supportingData: {
                    currentVelocity: featureVelocity,
                    recommendedMaximum: 10
                }
            };
        }
        
        return null;
    }

    private analyzeFocusAreas(focusAreas: ProjectEvolutionMetrics['focusAreas']): StrategicInsight[] {
        const insights: StrategicInsight[] = [];
        
        // Identify neglected areas
        const neglectedAreas = focusAreas.filter(area => 
            area.frequency < 2 && area.trend === 'decreasing'
        );
        
        if (neglectedAreas.length > 0) {
            insights.push({
                observation: "Some important areas are receiving decreased attention",
                impact: "May create technical debt or user experience gaps",
                recommendedActions: [
                    "Review resource allocation across different areas",
                    "Create dedicated maintenance schedules for neglected areas",
                    "Consider recruiting contributors with specific expertise"
                ],
                supportingData: {
                    neglectedAreas: neglectedAreas.map(area => area.category)
                }
            });
        }
        
        // Identify trending areas
        const trendingAreas = focusAreas.filter(area => 
            area.trend === 'increasing' && area.frequency > 3
        );
        
        if (trendingAreas.length > 0) {
            insights.push({
                observation: "Strong focus on specific development areas",
                impact: "Indicates project direction and potential specialization",
                recommendedActions: [
                    "Document best practices in these areas",
                    "Consider creating specialized working groups",
                    "Leverage expertise to attract more contributors"
                ],
                supportingData: {
                    trendingAreas: trendingAreas.map(area => area.category)
                }
            });
        }
        
        return insights;
    }

    private identifyGrowthOpportunities(maturity: ProjectMaturityIndicators): StrategicInsight[] {
        const insights: StrategicInsight[] = [];
        
        // Analyze documentation completeness
        if (maturity.documentationCompleteness < 0.7) {
            insights.push({
                observation: "Documentation coverage could be improved",
                impact: "May hinder new contributor onboarding and user adoption",
                recommendedActions: [
                    "Create a documentation improvement plan",
                    "Add more code examples and tutorials",
                    "Implement documentation review in PR process"
                ],
                supportingData: {
                    currentCoverage: maturity.documentationCompleteness,
                    target: 0.7
                }
            });
        }
        
        // Analyze test coverage
        if (maturity.testCoverage < 0.8) {
            insights.push({
                observation: "Test coverage below recommended threshold",
                impact: "May lead to reliability issues and harder maintenance",
                recommendedActions: [
                    "Set up coverage reporting in CI pipeline",
                    "Create testing guidelines for contributors",
                    "Prioritize tests for critical components"
                ],
                supportingData: {
                    currentCoverage: maturity.testCoverage,
                    target: 0.8
                }
            });
        }
        
        // Analyze community health
        if (maturity.communityHealth < 0.6) {
            insights.push({
                observation: "Community health metrics indicate room for improvement",
                impact: "May affect project sustainability and growth",
                recommendedActions: [
                    "Implement mentorship programs",
                    "Create more good first issues",
                    "Improve response time to community contributions"
                ],
                supportingData: {
                    healthScore: maturity.communityHealth,
                    target: 0.6
                }
            });
        }
        
        return insights;
    }

    private generateContributionStrategies(
        evolution: ProjectEvolutionMetrics,
        maturity: ProjectMaturityIndicators
    ): StrategicInsight[] {
        const insights: StrategicInsight[] = [];
        
        // Analyze contribution barriers
        if (maturity.communityHealth < 0.7 && evolution.communityEngagement.contributorGrowth < 10) {
            insights.push({
                observation: "Potential barriers to contribution identified",
                impact: "Limiting project growth and community expansion",
                recommendedActions: [
                    "Streamline contribution process",
                    "Create better contributing guidelines",
                    "Set up automated checks for common issues"
                ],
                supportingData: {
                    communityHealth: maturity.communityHealth,
                    contributorGrowth: evolution.communityEngagement.contributorGrowth
                }
            });
        }
        
        // Analyze maintenance needs
        if (maturity.maintenanceLevel < 0.6) {
            insights.push({
                observation: "Maintenance attention needed",
                impact: "May accumulate technical debt and reduce project quality",
                recommendedActions: [
                    "Schedule regular maintenance sprints",
                    "Create maintenance-focused contributor roles",
                    "Implement automated maintenance checks"
                ],
                supportingData: {
                    maintenanceLevel: maturity.maintenanceLevel,
                    target: 0.6
                }
            });
        }
        
        return insights;
    }

    private prioritizeInsights(insights: StrategicInsight[]): StrategicInsight[] {
        // Calculate priority scores based on impact and actionability
        const scoredInsights = insights.map(insight => {
            const impactScore = this.calculateImpactScore(insight);
            const actionabilityScore = this.calculateActionabilityScore(insight);
            return {
                ...insight,
                priorityScore: (impactScore + actionabilityScore) / 2
            };
        });
        
        // Sort by priority score
        return scoredInsights
            .sort((a, b) => (b as any).priorityScore - (a as any).priorityScore)
            .map(({ priorityScore, ...insight }) => insight);
    }

    private calculateImpactScore(insight: StrategicInsight): number {
        let score = 0;
        
        // Higher score for insights with quantifiable metrics
        if (insight.supportingData && typeof insight.supportingData === 'object') {
            score += 0.3;
        }
        
        // Higher score for insights affecting multiple areas
        if (insight.impact.includes(' and ')) {
            score += 0.2;
        }
        
        // Higher score for critical areas
        const criticalTerms = ['security', 'stability', 'breaking', 'critical'];
        if (criticalTerms.some(term => 
            insight.observation.toLowerCase().includes(term) || 
            insight.impact.toLowerCase().includes(term)
        )) {
            score += 0.5;
        }
        
        return score;
    }

    private calculateActionabilityScore(insight: StrategicInsight): number {
        let score = 0;
        
        // Higher score for more specific actions
        score += Math.min(0.5, insight.recommendedActions.length * 0.1);
        
        // Higher score for automated/tooling-related actions
        const automationTerms = ['automat', 'tool', 'ci', 'script'];
        score += 0.3 * insight.recommendedActions.filter(action => 
            automationTerms.some(term => action.toLowerCase().includes(term))
        ).length;
        
        // Lower score for vague actions
        const vagueTerms = ['consider', 'evaluate', 'review'];
        score -= 0.1 * insight.recommendedActions.filter(action =>
            vagueTerms.some(term => action.toLowerCase().includes(term))
        ).length;
        
        return Math.max(0, Math.min(1, score));
    }
}
