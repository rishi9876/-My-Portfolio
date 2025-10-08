
// NOTE: You must replace 'RishiBondugula' with your actual GitHub username for this to work.
const GITHUB_USERNAME = 'rishi-0706'; 
const PORTFOLIO_CONTAINER_ID = 'portfolio-projects';
const STATS_CONTAINER_CLASS = 'stats-placeholder'; // Class used in portfolio.html

async function fetchGitHubRepos() {
    try {
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos`);
        
        // Throw an error if the response isn't OK (e.g., 404 Not Found)
        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        
        const repos = await response.json();
        
        // Filter and sort repositories (e.g., show only non-forks, sorted by most recently updated)
        const featuredRepos = repos
            .filter(repo => !repo.fork)
            .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
            .slice(0, 6); // Display top 6 repositories

        displayRepos(featuredRepos);
    } catch (error) {
        console.error("Failed to fetch GitHub repositories:", error);
        const container = document.getElementById(PORTFOLIO_CONTAINER_ID);
        if (container) {
            container.innerHTML = '<p>Error loading repositories. Please check the console.</p>';
        }
    }
}

function displayRepos(repos) {
    const container = document.getElementById(PORTFOLIO_CONTAINER_ID);
    if (!container) return; // Exit if the container element is not found

    let htmlContent = '';
    
    repos.forEach(repo => {
        htmlContent += `
            <div class="project-card">
                <h3><a href="${repo.html_url}" target="_blank">${repo.name}</a></h3>
                <p>${repo.description || 'No description provided.'}</p>
                <div class="repo-meta">
                    <span class="language">${repo.language || 'N/A'}</span>
                    <span class="stars"><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                    <span class="updated">Updated: ${new Date(repo.updated_at).toLocaleDateString()}</span>
                </div>
            </div>
        `;
    });

    container.innerHTML = htmlContent;
}

async function fetchCodingStats() {
    const statsContainer = document.querySelector(`.${STATS_CONTAINER_CLASS}`);
    if (!statsContainer) return;

    // --- CONCEPTUAL FETCHING ---
    // In a real application, you would replace these mock fetches 
    // with calls to YOUR OWN backend/serverless function that handles
    // scraping or API access for LinkedIn/LeetCode.
    const MOCK_STATS_DATA = {
        leetcode: {
            totalSolved: 502,
            easy: 150,
            medium: 300,
            hard: 52
        },
        linkedin: {
            endorsements: 120,
            connections: 500
        }
    };

    // Simulate an API delay and success
    await new Promise(resolve => setTimeout(resolve, 800)); 

    try {
        const leetcodeStats = MOCK_STATS_DATA.leetcode;
        const linkedinStats = MOCK_STATS_DATA.linkedin;
        
        // Build the HTML for the stats display
        statsContainer.innerHTML = `
            <div class="stat-card leetcode-card">
                <i class="fas fa-code"></i>
                <h4>LeetCode Solved</h4>
                <p class="stat-value">${leetcodeStats.totalSolved}</p>
                <span class="detail">${leetcodeStats.hard} Hard, ${leetcodeStats.medium} Medium</span>
            </div>
            <div class="stat-card linkedin-card">
                <i class="fab fa-linkedin"></i>
                <h4>LinkedIn Connections</h4>
                <p class="stat-value">${linkedinStats.connections}+</p>
                <span class="detail">${linkedinStats.endorsements} Endorsements</span>
            </div>
        `;
    } catch (error) {
        // This catch block would handle real network errors
        statsContainer.innerHTML = '<p class="error-message">Could not load all coding statistics.</p>';
        console.error("Failed to fetch coding statistics:", error);
    }
}

// Run the functions when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Only fetch GitHub repos if the container is present (i.e., on portfolio.html)
    if (document.getElementById(PORTFOLIO_CONTAINER_ID)) {
        fetchGitHubRepos();
        fetchCodingStats(); // Call the new stat function here
    }
});