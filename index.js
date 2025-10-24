
import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function initHome() {

  const projects = await fetchJSON('./lib/projects.json');
  console.log('✅ Projects loaded:', projects);

  const latestProjects = projects.slice(0, 3);
  const projectsContainer = document.querySelector('.projects');
  renderProjects(latestProjects, projectsContainer, 'h3');

  const githubData = await fetchGitHubData('TiantianZheng');
  console.log('✅ GitHub data loaded:', githubData);

  const profileStats = document.querySelector('#profile-stats');

  // 5️⃣ Dynamically update HTML with your GitHub info
  if (profileStats) {
    profileStats.innerHTML = `
      <h2>GitHub Stats</h2>
      <dl>
        <dt>Public Repos:</dt><dd>${githubData.public_repos}</dd>
        <dt>Public Gists:</dt><dd>${githubData.public_gists}</dd>
        <dt>Followers:</dt><dd>${githubData.followers}</dd>
        <dt>Following:</dt><dd>${githubData.following}</dd>
      </dl>
    `;
  }
}

initHome();