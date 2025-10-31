import { fetchJSON, renderProjects } from '../global.js';
import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

async function initProjects() {
    const projects = await fetchJSON('../lib/projects.json');
    const projectsContainer = document.querySelector('.projects');
    renderProjects(projects, projectsContainer, 'h2');
    const title = document.querySelector('.projects-title');
    if (title && projects) {
        title.innerHTML = `<strong>${projects.length}</strong> Projects`;
    }
    }
initProjects();

let svg = d3.select("#projects-pie-plot");

let arcGenerator = d3.arc()
  .innerRadius(0)
  .outerRadius(50);

// let arc = arcGenerator({
//   startAngle: 0,
//   endAngle: 2 * Math.PI
// });
// svg.append("path")
//   .attr("d", arc)
//   .attr("fill", "red");

let data = [1, 2, 3, 4, 5, 5];
let sliceGenerator = d3.pie();
let arcData = sliceGenerator(data);
let arcs = arcData.map((d) => arcGenerator(d));
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
let colors = d3.scaleOrdinal(d3.schemeTableau10);

arcs.forEach((arc, idx) => {
  svg.append("path")
    .attr("d", arc)
    .attr("fill", colors[idx]);
});