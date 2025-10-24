import { fetchJSON, renderProjects, fetchGitHubData } from './global.js';

async function initHome() {
  // Load projects (optional)
  const projects = await fetchJSON('./lib/projects.json');
  renderProjects(projects.slice(0, 3), document.querySelector('.projects'), 'h3');

  // Fetch GitHub data
  const githubData = await fetchGitHubData('your-username'); // replace with yours

  // Update stats
  document.getElementById('followers').textContent = githubData.followers;
  document.getElementById('following').textContent = githubData.following;
  document.getElementById('repos').textContent = githubData.public_repos;
  document.getElementById('gists').textContent = githubData.public_gists;
}

initHome();