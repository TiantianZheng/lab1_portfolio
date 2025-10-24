import { fetchJSON, renderProjects, fetchGithubData } from './global.js';
async function initHome() {
    const projects = await fetchJSON('./lib/projects.json');
    const latestProjects = projects.slice(0, 3);
    const projectsContainer = document.querySelector('.projects');
    renderProjects(latestProjects, projectsContainer, 'h2');
    console.log('✅ Latest projects loaded:', latestProjects);
  }
  initHome();