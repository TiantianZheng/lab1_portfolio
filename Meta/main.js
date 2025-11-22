import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
import scrollama from 'https://cdn.jsdelivr.net/npm/scrollama@3.2.0/+esm';

let data;
let commits;
let filteredCommits;
let commitProgress = 100;
let timeScale;
let commitMaxTime;
let xScale, yScale;
let colors;

async function loadData() {
    try {
        const data = await d3.csv('loc.csv', (row) => ({
            ...row,
            line: Number(row.line), 
            depth: Number(row.depth),
            length: Number(row.length),
            date: new Date(row.date + 'T00:00' + row.timezone),
            datetime: new Date(row.datetime),
        }));
        console.log('Data loaded:', data);
        return data;
    } catch (error) {
        console.error('Error loading data:', error);
        return [];
    }
}

function processCommits(data) {
    let commits = d3
        .groups(data, (d) => d.commit)
        .map(([commit, lines]) => {
            let first = lines[0];
            let { author, date, time, timezone, datetime } = first;
            let ret = {
                id: commit,
                url: 'https://github.com/TiantianZheng/lab1_portfolio/commit/' + commit,
                author,
                date,
                time,
                timezone,
                datetime,
                hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
                totalLines: lines.length,
            };

            Object.defineProperty(ret, 'lines', {
                value: lines,
                enumerable: false,
                configurable: true,
            });

            return ret;
        });

    commits.sort((a, b) => a.datetime - b.datetime);

    return commits;
}


function renderCommitInfo(data, commits) {
    const container = d3.select('#stats').append('div').attr('class', 'stats');

    function addStat(label, value) {
        const card = container.append('div').attr('class', 'stat');
        card.append('dt').text(label);
        card.append('dd').text(value);
    }

    addStat('COMMITS', commits.length);
    addStat('FILES', d3.group(data, (d) => d.file).size);
    addStat('TOTAL LOC', data.length);
    addStat('AVG FILE LENGTH', d3.mean(
        d3.rollups(data, (v) => d3.max(v, (d) => d.line), (d) => d.file),
        (d) => d[1]
    ).toFixed(2));

    addStat('MAX DEPTH', d3.max(data, (d) => d.depth));
    addStat('LONGEST LINE', d3.max(data, (d) => d.length));
}

function updateFileDisplay(filteredCommits) {
    // Get lines from filtered commits
    let lines = filteredCommits.flatMap((d) => d.lines);
    
    // Group lines by file and sort by number of lines (descending)
    let files = d3
        .groups(lines, (d) => d.file)
        .map(([name, lines]) => {
            return { name, lines };
        })
        .sort((a, b) => b.lines.length - a.lines.length);

    // Create color scale for technologies
    colors = d3.scaleOrdinal(d3.schemeTableau10);

    // Update files container
    let filesContainer = d3
        .select('#files')
        .selectAll('div')
        .data(files, (d) => d.name)
        .join(
            // This code only runs when the div is initially rendered
            (enter) =>
                enter.append('div').call((div) => {
                    div.append('dt').append('code');
                    div.append('dd');
                }),
        );

    // Update file names with line counts
    filesContainer.select('dt > code')
        .html((d) => `${d.name}<small>${d.lines.length} lines</small>`);

    // Clear and update the line visualization
    filesContainer.select('dd')
        .selectAll('div.loc')
        .data((d) => d.lines)
        .join('div')
        .attr('class', 'loc')
        .attr('style', (d) => `--color: ${colors(d.type)}`);
}



function renderTooltipContent(commit) {
    const link = document.getElementById('commit-link');
    const date = document.getElementById('commit-date');
    const author = document.getElementById('commit-author');
    const lines = document.getElementById('commit-lines');

    if (!commit) return;

    link.href = commit.url;
    link.textContent = commit.id.slice(0, 7);
    date.textContent = commit.datetime?.toLocaleString('en', {
        dateStyle: 'medium',
        timeStyle: 'short',
    });
    author.textContent = commit.author || 'Unknown';
    lines.textContent = commit.totalLines;
}

function updateTooltipVisibility(isVisible) {
    const tooltip = document.getElementById('commit-tooltip');
    tooltip.hidden = !isVisible;
}

function updateTooltipPosition(event) {
    const tooltip = document.getElementById('commit-tooltip');
    const offset = 15;
    tooltip.style.left = `${event.clientX + offset}px`;
    tooltip.style.top = `${event.clientY + offset}px`;
}

function updateScatterPlotToTime(targetTime) {
    filteredCommits = commits.filter(d => d.datetime <= targetTime);
    updateScatterPlot(data, filteredCommits);
    updateFileDisplay(filteredCommits);
}

// function onTimeSliderChange() {
//     const slider = document.getElementById("commit-progress");
//     commitProgress = +slider.value;

//     commitMaxTime = timeScale.invert(commitProgress);

//     document.getElementById("commit-time").textContent =
//         commitMaxTime.toLocaleString("en-US", {
//             dateStyle: "long",
//             timeStyle: "short"
//         });

//     filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);
//     updateScatterPlot(data, filteredCommits);
//     updateFileDisplay(filteredCommits);
// }

function renderScatterPlot(data, commits) {
    console.log('Rendering scatter plot with', commits.length, 'commits');
    
    const width = 1000;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 30, left: 20 };

    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
    };

 
    d3.select('#chart').html('');
    
    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('viewBox', `0 0 ${width} ${height}`)
        .style('overflow', 'visible');


    xScale = d3.scaleTime()
        .domain(d3.extent(commits, (d) => d.datetime))
        .range([usableArea.left, usableArea.right])
        .nice();

    yScale = d3.scaleLinear()
        .domain([0, 24])
        .range([usableArea.bottom, usableArea.top]);


    const gridlines = svg.append('g')
        .attr('class', 'gridlines')
        .attr('transform', `translate(${usableArea.left}, 0)`);

    gridlines.call(
        d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width)
    );

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale)
        .tickFormat(d => String(d % 24).padStart(2, '0') + ':00');


    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${usableArea.bottom})`)
        .call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");
    
   
    svg.append('g')
        .attr('class', 'y-axis')
        .attr('transform', `translate(${usableArea.left}, 0)`)
        .call(yAxis);

    
    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
    const rScale = d3.scaleSqrt()
        .domain([minLines, maxLines])
        .range([5, 25]);

    const sortedCommits = d3.sort(commits, (d) => -d.totalLines);
    const dots = svg.append('g').attr('class', 'dots');
    
    dots
        .selectAll('circle')
        .data(sortedCommits, d => d.id)
        .join('circle')
        .attr('cx', (d) => xScale(d.datetime))
        .attr('cy', (d) => yScale(d.hourFrac))
        .attr('r', (d) => rScale(d.totalLines))
        .attr('fill', 'steelblue')
        .style('fill-opacity', 0.4)
        .on('mouseenter', (event, commit) => {
            renderTooltipContent(commit);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);
        })
        .on('mousemove', (event) => {
            updateTooltipPosition(event);
        })
        .on('mouseleave', () => {
            updateTooltipVisibility(false);
        });

    
    function isCommitSelected(selection, commit) {
        if (!selection) return false;
        const [[x0, y0], [x1, y1]] = selection;
        const x = xScale(commit.datetime);
        const y = yScale(commit.hourFrac);
        return x0 <= x && x <= x1 && y0 <= y && y <= y1;
    }

    function renderSelectionCount(selection, commits) {
        const selectedCommits = selection
            ? commits.filter((d) => isCommitSelected(selection, d))
            : [];
        const countElement = document.querySelector('#selection-count');
        countElement.textContent = `${selectedCommits.length || 'No'} commits selected`;
        return selectedCommits;
    }

    function renderLanguageBreakdown(selection) {
        const selectedCommits = selection
            ? commits.filter((d) => isCommitSelected(selection, d))
            : [];
        const container = document.getElementById('language-breakdown');

        if (selectedCommits.length === 0) {
            container.innerHTML = '';
            return;
        }

        const lines = selectedCommits.flatMap((d) => d.lines);
        const breakdown = d3.rollup(
            lines,
            (v) => v.length,
            (d) => d.type
        );

        container.innerHTML = '';
        const total = lines.length;

        for (const [language, count] of breakdown) {
            const proportion = count / total;
            const formatted = d3.format('.1~%')(proportion);
            container.innerHTML += `
                <dt>${language}</dt>
                <dd>${count} lines (${formatted})</dd>
            `;
        }
    }

    function brushed(event) {
        const selection = event.selection;
        d3.selectAll('circle').classed('selected', (d) =>
            isCommitSelected(selection, d)
        );
        renderSelectionCount(selection, commits);
        renderLanguageBreakdown(selection);
    }

    const brush = d3.brush()
        .extent([
            [usableArea.left, usableArea.top],
            [usableArea.right, usableArea.bottom]
        ])
        .on('start brush end', brushed);
    
    svg.call(brush);
    svg.selectAll('.dots, .overlay ~ *').raise();
}

function updateScatterPlot(data, commits) {
    console.log('Updating scatter plot with', commits.length, 'commits');
    
    if (!xScale || !yScale) {
        console.error('Scales not initialized!');
        return;
    }

    const width = 1000;
    const height = 600;
    const margin = { top: 10, right: 10, bottom: 30, left: 20 };
    const usableArea = {
        top: margin.top,
        right: width - margin.right,
        bottom: height - margin.bottom,
        left: margin.left,
        width: width - margin.left - margin.right,
        height: height - margin.top - margin.bottom,
    };

    const svg = d3.select('#chart').select('svg');

  
    xScale.domain(d3.extent(commits, (d) => d.datetime));

    const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
    const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([8, 35]);

    const xAxis = d3.axisBottom(xScale);

  
    const xAxisGroup = svg.select('g.x-axis');
    xAxisGroup.selectAll('*').remove();
    xAxisGroup.call(xAxis)
        .selectAll("text")
        .attr("transform", "rotate(-30)")
        .style("text-anchor", "end");

 
    const dots = svg.select('g.dots');
    const sortedCommits = d3.sort(commits, (d) => -d.totalLines);
    
    dots
        .selectAll('circle')
        .data(sortedCommits, d => d.id)
        .join(
            enter => enter.append('circle')
                .attr('cx', (d) => xScale(d.datetime))
                .attr('cy', (d) => yScale(d.hourFrac))
                .attr('r', 0)
                .attr('fill', 'steelblue')
                .style('fill-opacity', 0.4)
                .call(enter => enter.transition().duration(500)
                    .attr('r', (d) => rScale(d.totalLines))
                ),
            update => update
                .call(update => update.transition().duration(500)
                    .attr('cx', (d) => xScale(d.datetime))
                    .attr('cy', (d) => yScale(d.hourFrac))
                    .attr('r', (d) => rScale(d.totalLines))
                ),
            exit => exit
                .call(exit => exit.transition().duration(300)
                    .attr('r', 0)
                    .remove()
                )
        )
        .on('mouseenter', (event, commit) => {
            d3.select(event.currentTarget).style('fill-opacity', 0.8);
            renderTooltipContent(commit);
            updateTooltipVisibility(true);
            updateTooltipPosition(event);
        })
        .on('mousemove', (event) => {
            updateTooltipPosition(event);
        })
        .on('mouseleave', (event) => {
            d3.select(event.currentTarget).style('fill-opacity', 0.4);
            updateTooltipVisibility(false);
        });
}
// Scrollytelling 功能
function generateCommitStory() {
    d3.select('#scatter-story')
        .selectAll('.step')
        .data(commits)
        .join('div')
        .attr('class', 'step')
        .html(
            (d, i) => `
            <p>
                On ${d.datetime.toLocaleString('en', {
                    dateStyle: 'full',
                    timeStyle: 'short',
                })},
                I made <a href="${d.url}" target="_blank">${
                    i > 0 ? 'another glorious commit' : 'my first commit, and it was glorious'
                }</a>.
                I edited ${d.totalLines} lines across ${
                    d3.rollups(
                        d.lines,
                        (D) => D.length,
                        (d) => d.file,
                    ).length
                } files.
                Then I looked over all I had made, and I saw that it was very good.
            </p>
            `,
        );
}

function onStepEnter(response) {
    console.log('Step entered:', response.element.__data__.datetime);
    const commitTime = response.element.__data__.datetime;
    updateScatterPlotToTime(commitTime);
}


async function init() {
    data = await loadData();
    commits = processCommits(data);  
    renderCommitInfo(data, commits);

    timeScale = d3.scaleTime()
        .domain([
            d3.min(commits, d => d.datetime),
            d3.max(commits, d => d.datetime)
        ])
        .range([0, 100]);

    filteredCommits = commits;
    generateCommitStory();

    renderScatterPlot(data, filteredCommits);
    updateFileDisplay(filteredCommits);
    
    const scroller = scrollama();
    scroller
        .setup({
            container: '#scrolly-1',
            step: '#scrolly-1 .step',
            offset: 0.6, 
        })
        .onStepEnter(onStepEnter);

    window.addEventListener('resize', scroller.resize);
}

init();
