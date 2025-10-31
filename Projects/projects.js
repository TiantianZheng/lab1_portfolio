import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
const projectsContainer = document.querySelector('.projects');
const svg = d3.select("#projects-pie-plot");
const legend = d3.select('.legend');

// async function initProjects() {
//     const projects = await fetchJSON('../lib/projects.json');
//     const projectsContainer = document.querySelector('.projects');
//     renderProjects(projects, projectsContainer, 'h2');
//     const title = document.querySelector('.projects-title');
//     if (title && projects) {
//         title.innerHTML = `<strong>${projects.length}</strong> Projects`;
//     }
//     }
// initProjects();

async function initProjects() {
    const projects = await fetchJSON('../lib/projects.json');
 
    renderProjects(projects, projectsContainer, 'h2');

    const title = document.querySelector('.projects-title');
    if (title) title.innerHTML = `<strong>${projects.length}</strong> Projects`;

    renderPieChart(projects);
  
    setupSearch(projects);
  }
  
initProjects();


// let arcGenerator = d3.arc()
//   .innerRadius(0)
//   .outerRadius(50);
// let arc = arcGenerator({
//   startAngle: 0,
//   endAngle: 2 * Math.PI
// });
// svg.append("path")
//   .attr("d", arc)
//   .attr("fill", "red");

// let data = [
//     { value: 1, label: 'apples' },
//     { value: 2, label: 'oranges' },
//     { value: 3, label: 'mangos' },
//     { value: 4, label: 'pears' },
//     { value: 5, label: 'limes' },
//     { value: 5, label: 'cherries' },
//   ];
//   let sliceGenerator = d3.pie().value((d) => d.value);
// let arcData = sliceGenerator(data);
// let arcs = arcData.map((d) => arcGenerator(d));
// let total = 0;
// for (let d of data) {
//   total += d;
// }

// let angle = 0;
// let arcData = [];

// for (let d of data) {
//   let endAngle = angle + (d / total) * 2 * Math.PI;
//   arcData.push({ startAngle: angle, endAngle });
//   angle = endAngle;
// }

// let arcs = arcData.map((d) => arcGenerator(d));
// let colors = d3.scaleOrdinal(d3.schemeTableau10);

// arcs.forEach((arc, idx) => {
//   svg.append("path")
//     .attr("d", arc)
//     .attr("fill", colors(idx));
// });

// data.forEach((d, idx) => {
//   legend
//     .append('li')
//     .attr('style', `--color:${colors(idx)}`) // set the style attribute while passing in parameters
//     .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`); // set the inner html of <li>
// });

function prepareYearData(projects) {
    let rolledData = d3.rollups(
      projects,
      v => v.length,
      d => d.year
    );
  
    return rolledData.map(([year, count]) => ({
      value: count,
      label: year
    }));
  }
function renderPieChart(projectsGiven) {

let data = prepareYearData(projectsGiven);
if (!data.length) return; 

let arcGenerator = d3.arc().innerRadius(0).outerRadius(50);
let sliceGenerator = d3.pie().value(d => d.value);
let arcData = sliceGenerator(data);
let arcs = arcData.map(d => arcGenerator(d));
let colors = d3.scaleOrdinal(d3.schemeTableau10);

arcs.forEach((arc, i) => {
    svg.append('path')
    .attr('d', arc)
    .attr('fill', colors(i))
    .attr('stroke', 'white')
    .attr('stroke-width', 0.5);
});

data.forEach((d, i) => {
    legend.append('li')
    .attr('style', `--color:${colors(i)}`)
    .html(`<span class="swatch"></span> ${d.label} <em>(${d.value})</em>`);
});
}

function setupSearch(allProjects) {
const searchInput = document.querySelector('.searchBar');
if (!searchInput) return;

searchInput.addEventListener('input', (event) => {
    const query = event.target.value.toLowerCase();

    const filteredProjects = allProjects.filter(project => {
    const values = Object.values(project).join('\n').toLowerCase();
    return values.includes(query);
    });

    renderProjects(filteredProjects, projectsContainer, 'h2');
    renderPieChart(filteredProjects);
});
}
