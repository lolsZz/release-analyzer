"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const rest_1 = require("@octokit/rest");
const dotenv = __importStar(require("dotenv"));
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// Load environment variables
dotenv.config({ path: path.join(__dirname, '.env') });
class GitHubReleaseAnalyzer {
    octokit;
    outputPath;
    constructor() {
        const token = process.env.GITHUB_TOKEN;
        if (!token) {
            throw new Error('GITHUB_TOKEN environment variable is not set');
        }
        this.octokit = new rest_1.Octokit({
            auth: token
        });
        this.outputPath = path.join(__dirname, '..', 'release-notes');
    }
    async fetchReleaseNotes(owner, repo) {
        try {
            const { data: releases } = await this.octokit.repos.listReleases({
                owner,
                repo,
                per_page: 100 // Fetch up to 100 releases
            });
            return releases.map(release => ({
                tagName: release.tag_name,
                name: release.name,
                body: release.body ?? null, // Convert undefined to null
                createdAt: release.created_at,
                url: release.html_url
            }));
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to fetch release notes: ${error.message}`);
            }
            throw error;
        }
    }
    async saveReleaseNotes(owner, repo) {
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
        }
        catch (error) {
            if (error instanceof Error) {
                console.error('Error saving release notes:', error.message);
                process.exit(1);
            }
        }
    }
    generateMarkdown(releases) {
        return releases.map(release => {
            return `# ${release.name || release.tagName}\n\n` +
                `**Tag:** ${release.tagName}\n` +
                `**Created:** ${new Date(release.createdAt).toLocaleDateString()}\n` +
                `**URL:** ${release.url}\n\n` +
                `${release.body || 'No description provided.'}\n\n` +
                '---\n';
        }).join('\n');
    }
}
// Example usage
async function main() {
    const analyzer = new GitHubReleaseAnalyzer();
    // Example: Fetch React's release notes
    // You can change these parameters to analyze any public repository
    await analyzer.saveReleaseNotes('facebook', 'react');
}
main().catch(error => {
    console.error('Error:', error.message);
    process.exit(1);
});
