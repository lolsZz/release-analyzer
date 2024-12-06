import { Octokit } from '@octokit/rest';
import * as dotenv from 'dotenv';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ReleaseAnalyzer } from './analyzer';
import { ReleaseNote, Reaction, Contributor } from './types';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });

interface RepoInfo {
  owner: string;
  repo: string;
  fullName: string;
}

function parseGitHubUrl(url: string): RepoInfo {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') {
      throw new Error('Not a GitHub URL');
    }

    const [, owner, repo] = urlObj.pathname.split('/');
    if (!owner || !repo) {
      throw new Error('Invalid GitHub repository URL');
    }

    return { 
      owner, 
      repo: repo.replace('.git', ''),
      fullName: `${owner}/${repo.replace('.git', '')}`
    };
  } catch (error) {
    // Try parsing as owner/repo format
    const parts = url.split('/');
    if (parts.length === 2) {
      const [owner, repo] = parts;
      return { 
        owner, 
        repo: repo.replace('.git', ''),
        fullName: `${owner}/${repo.replace('.git', '')}`
      };
    }
    throw new Error('Invalid GitHub repository URL or format. Please use either https://github.com/owner/repo or owner/repo format.');
  }
}

class GitHubReleaseAnalyzer {
  private octokit: Octokit;
  private outputPath: string;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('GITHUB_TOKEN environment variable is not set');
    }

    this.octokit = new Octokit({
      auth: token
    });

    this.outputPath = path.join(__dirname, '..', 'release-notes');
  }

  private async fetchReleaseReactions(owner: string, repo: string, releaseId: number): Promise<Reaction[]> {
    try {
      const { data: reactions } = await this.octokit.reactions.listForRelease({
        owner,
        repo,
        release_id: releaseId,
        per_page: 100
      });

      // Group reactions by type and count them
      const reactionCounts = new Map<string, number>();
      reactions.forEach(reaction => {
        const count = reactionCounts.get(reaction.content) || 0;
        reactionCounts.set(reaction.content, count + 1);
      });

      return Array.from(reactionCounts.entries()).map(([type, count]) => ({
        type,
        totalCount: count
      }));
    } catch (error) {
      console.warn(`Warning: Could not fetch reactions for release ${releaseId}:`, error);
      return [];
    }
  }

  private async fetchReleaseContributors(owner: string, repo: string, tagName: string): Promise<Contributor[]> {
    try {
      // Get commits for this release
      const { data: commits } = await this.octokit.repos.listCommits({
        owner,
        repo,
        sha: tagName,
        per_page: 100
      });

      // Count contributions per author
      const contributorMap = new Map<string, number>();
      commits.forEach(commit => {
        if (commit.author?.login) {
          const count = contributorMap.get(commit.author.login) || 0;
          contributorMap.set(commit.author.login, count + 1);
        }
      });

      return Array.from(contributorMap.entries()).map(([login, contributions]) => ({
        login,
        contributions
      }));
    } catch (error) {
      console.warn(`Warning: Could not fetch contributors for tag ${tagName}:`, error);
      return [];
    }
  }

  async fetchReleaseNotes(owner: string, repo: string): Promise<ReleaseNote[]> {
    try {
      const { data: releases } = await this.octokit.repos.listReleases({
        owner,
        repo,
        per_page: 100
      });

      const releaseNotes: ReleaseNote[] = [];

      for (const release of releases) {
        const [reactions, contributors] = await Promise.all([
          this.fetchReleaseReactions(owner, repo, release.id),
          this.fetchReleaseContributors(owner, repo, release.tag_name)
        ]);

        releaseNotes.push({
          tagName: release.tag_name,
          name: release.name,
          body: release.body ?? null,
          createdAt: release.created_at,
          url: release.html_url,
          reactions,
          contributors
        });
      }

      return releaseNotes;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to fetch release notes: ${error.message}`);
      }
      throw error;
    }
  }

  async saveReleaseNotes(owner: string, repo: string): Promise<ReleaseNote[]> {
    try {
      const releases = await this.fetchReleaseNotes(owner, repo);
      
      // Create output directory if it doesn't exist
      await fs.mkdir(this.outputPath, { recursive: true });
      
      // Save as JSON for further analysis
      const jsonPath = path.join(this.outputPath, `${owner}-${repo}-releases.json`);
      await fs.writeFile(jsonPath, JSON.stringify(releases, null, 2));

      // Save as markdown for human readability
      const mdPath = path.join(this.outputPath, `${owner}-${repo}-releases.md`);
      const markdown = this.generateMarkdown(releases);
      await fs.writeFile(mdPath, markdown);

      console.log(`Release notes saved to:\n- ${jsonPath}\n- ${mdPath}`);
      
      return releases;
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error saving release notes:', error.message);
        process.exit(1);
      }
      throw error;
    }
  }

  private generateMarkdown(releases: ReleaseNote[]): string {
    return releases.map(release => {
      const contributorCount = release.contributors.length;
      const reactionCount = release.reactions.reduce((sum, r) => sum + r.totalCount, 0);
      
      return `# ${release.name || release.tagName}\n\n` +
        `**Tag:** ${release.tagName}\n` +
        `**Created:** ${new Date(release.createdAt).toLocaleDateString()}\n` +
        `**URL:** ${release.url}\n` +
        `**Contributors:** ${contributorCount}\n` +
        `**Reactions:** ${reactionCount}\n\n` +
        `${release.body || 'No description provided.'}\n\n` +
        '---\n';
    }).join('\n');
  }
}

async function main() {
  // Get repository URL from command line arguments
  const repoUrl = process.argv[2];
  if (!repoUrl) {
    console.error('Please provide a GitHub repository URL or owner/repo format.');
    console.error('Example: npm start https://github.com/facebook/react');
    console.error('   or  : npm start facebook/react');
    process.exit(1);
  }

  try {
    const repoInfo = parseGitHubUrl(repoUrl);
    console.log(`Analyzing repository: ${repoInfo.fullName}`);

    const analyzer = new GitHubReleaseAnalyzer();
    const releases = await analyzer.saveReleaseNotes(repoInfo.owner, repoInfo.repo);

    // Generate feature story
    const releaseAnalyzer = new ReleaseAnalyzer(releases, repoInfo.fullName);
    const featureStory = releaseAnalyzer.generateMarkdownSummary();
    const releaseRatings = releaseAnalyzer.generateRatingMarkdown();

    // Save feature story and ratings
    const featureStoryPath = path.join(__dirname, '..', 'release-notes', `${repoInfo.owner}-${repoInfo.repo}-feature-story.md`);
    const ratingsPath = path.join(__dirname, '..', 'release-notes', `${repoInfo.owner}-${repoInfo.repo}-ratings.md`);
    
    await Promise.all([
      fs.writeFile(featureStoryPath, featureStory),
      fs.writeFile(ratingsPath, releaseRatings)
    ]);
    
    console.log(`Feature story saved to: ${featureStoryPath}`);
    console.log(`Release ratings saved to: ${ratingsPath}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error:', error.message);
    }
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Error:', error.message);
  process.exit(1);
});
