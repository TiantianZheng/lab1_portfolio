import { fetchJSON, renderProjects } from '../global.js';

async function initProjects() {
    try {
     
      const projects = await fetchJSON('../lib/projects.json');
  
    
      const projectsContainer = document.querySelector('.projects');
  
      renderProjects(projects, projectsContainer, 'h2');
  
      const title = document.querySelector('.projects-title');
      if (title && projects) {
        title.textContent = `Projects (${projects.length})`;
      }
  
      console.log('✅ Projects loaded:', projects);
    } catch (error) {
      console.error('❌ Error loading projects:', error);
    }
  }
  
  // 立即执行
  initProjects()