import { fetchJSON, renderProjects } from '../global.js';

async function initProjects() {
    const projects = await fetchJSON('../lib/projects.json');
    const projectsContainer = document.querySelector('.projects');
    renderProjects(projects, projectsContainer, 'h2');
    const title = document.querySelector('.projects-title');
    if (title && projects) {
        title.textContent = `Projects (${projects.length})`;
    }
}

initProjects();