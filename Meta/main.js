// import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';
// async function loadData() {
  
//     const data = await d3.csv('loc.csv', (row) => ({
//       ...row,
//       line: Number(row.line), 
//       depth: Number(row.depth),
//       length: Number(row.length),
//       date: new Date(row.date + 'T00:00' + row.timezone),
//       datetime: new Date(row.datetime),
//     }));
//     console.log(data);
//     return data;
//   }
  
// function processCommits(data) {
// return d3
//     .groups(data, (d) => d.commit)
//     .map(([commit, lines]) => {
//     let first = lines[0];
//     let { author, date, time, timezone, datetime } = first;
//     let ret = {
//         id: commit,
//         url: 'https://github.com/TiantianZheng/lab1_portfolio/commit/' + commit,
//         author,
//         date,
//         time,
//         timezone,
//         datetime,
//         hourFrac: datetime.getHours() + datetime.getMinutes() / 60,
//         totalLines: lines.length,
//     };

//     Object.defineProperty(ret, 'lines', {
//         value: lines,
//         enumerable: false,
//         configurable: true,
//       });
  

//     return ret;
//     });
// }

// function renderCommitInfo(data, commits) {
//     const container = d3.select('#stats').append('div').attr('class', 'stats');
  
//     function addStat(label, value) {
//       const card = container.append('div').attr('class', 'stat');
//       card.append('dt').text(label);
//       card.append('dd').text(value);
//     }
  
//     addStat('COMMITS', commits.length);
//     addStat('FILES', d3.group(data, (d) => d.file).size);
//     addStat('TOTAL LOC', data.length);
//     addStat('AVG FILE LENGTH', d3.mean(
//       d3.rollups(data, (v) => d3.max(v, (d) => d.line), (d) => d.file),
//       (d) => d[1]
//     ).toFixed(2));
  
//     addStat('MAX DEPTH', d3.max(data, (d) => d.depth));
//     addStat('LONGEST LINE', d3.max(data, (d) => d.length));
//   }


// let data = await loadData();
// let commits = processCommits(data);  
// renderCommitInfo(data, commits);

// let commitProgress = 100;

// let timeScale = d3.scaleTime()
//   .domain([
//     d3.min(commits, d => d.datetime),
//     d3.max(commits, d => d.datetime)
//   ])
//   .range([0, 100]);

// let xScale;
// let yScale;

// let commitMaxTime = timeScale.invert(commitProgress);

// let filteredCommits = commits;

// function renderTooltipContent(commit) {
//     const link = document.getElementById('commit-link');
//     const date = document.getElementById('commit-date');
//     const author = document.getElementById('commit-author');
//     const lines = document.getElementById('commit-lines');
  
//     if (!commit) return;
  
//     link.href = commit.url;
//     link.textContent = commit.id.slice(0, 7);
//     date.textContent = commit.datetime?.toLocaleString('en', {
//       dateStyle: 'medium',
//       timeStyle: 'short',
//     });
//     author.textContent = commit.author || 'Unknown';
//     lines.textContent = commit.totalLines;
//   }
  
//   function updateTooltipVisibility(isVisible) {
//     const tooltip = document.getElementById('commit-tooltip');
//     tooltip.hidden = !isVisible;
//   }
  
//   function updateTooltipPosition(event) {
//     const tooltip = document.getElementById('commit-tooltip');
//     const offset = 15;
//     tooltip.style.left = `${event.clientX + offset}px`;
//     tooltip.style.top = `${event.clientY + offset}px`;
//   }

// function onTimeSliderChange() {
//   const slider = document.getElementById("commit-progress");
//   commitProgress = +slider.value;

//   commitMaxTime = timeScale.invert(commitProgress);

  
//   document.getElementById("commit-time").textContent =
//     commitMaxTime.toLocaleString("en-US", {
//       dateStyle: "long",
//       timeStyle: "short"
//     });

//   filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);

//   updateScatterPlot(data, filteredCommits);
// }




// function renderScatterPlot(data, commits) {
//     const width = 1000;
//     const height = 600;
//     const margin = { top: 10, right: 10, bottom: 30, left: 20 }

//     const usableArea = {
//         top: margin.top,
//         right: width - margin.right,
//         bottom: height - margin.bottom,
//         left: margin.left,
//         width: width - margin.left - margin.right,
//         height: height - margin.top - margin.bottom,
//       };
   
      
//     const svg = d3
//     .select('#chart')
//     .append('svg')
//     .attr('viewBox', `0 0 ${width} ${height}`)
//     .style('overflow', 'visible');

//     xScale = d3.scaleTime()
//       .domain(d3.extent(commits, (d) => d.datetime))
//       .range([usableArea.left, usableArea.right])
//       .nice();

//     yScale = d3.scaleLinear()
//       .domain([0, 24])
//       .range([usableArea.bottom, usableArea.top]);

  
//     xScale.range([usableArea.left, usableArea.right]);
//     yScale.range([usableArea.bottom, usableArea.top]);

//     const gridlines = svg.append('g')
//     .attr('class', 'gridlines')
//     .attr('transform', `translate(${usableArea.left}, 0)`);

//     gridlines.call(
//     d3.axisLeft(yScale).tickFormat('').tickSize(-usableArea.width)
//     );


//     const xAxis = d3.axisBottom(xScale);
    
//     const yAxis = d3.axisLeft(yScale)
//     .tickFormat(d => String(d % 24).padStart(2, '0') + ':00');

//     // Add X axis

//     svg.append("g")
//     .attr("class", "x-axis")
//     .attr("transform", `translate(0, ${usableArea.bottom})`)
//     .call(xAxis)
//     .selectAll("text")
//     .attr("transform", "rotate(-30)")
//     .style("text-anchor", "end");
    
//     // Add Y axis
//     svg.append('g')
//     .attr('class', 'y-axis')
//     .attr('transform', `translate(${usableArea.left}, 0)`)
//     .call(yAxis);

//     const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);

//     const rScale = d3
//     .scaleSqrt()
//     .domain([minLines, maxLines])
//     .range([8, 35]); 

//     const sortedCommits = d3.sort(commits, (d) => -d.totalLines);
//     const dots = svg.append('g').attr('class', 'dots');
//     dots
//     .selectAll('circle')
//     .data(sortedCommits, d => d.id)
//     .join('circle')
//     .attr('cx', (d) => xScale(d.datetime))
    
//     .attr('cy', (d) => yScale(d.hourFrac))
//     .attr('r', (d) => rScale(d.totalLines))
//     .attr('fill', 'steelblue')
//     .style('fill-opacity', 0.4)
//     .on('mouseenter', (event, commit) => {
//       renderTooltipContent(commit);
//       updateTooltipVisibility(true);
//       updateTooltipPosition(event);
//     })
//     .on('mousemove', (event) => {
//       updateTooltipPosition(event);
//     })
//     .on('mouseleave', () => {
//       updateTooltipVisibility(false);
//     });

//     function isCommitSelected(selection, commit) {
//         if (!selection) return false;
    
//         const [[x0, y0], [x1, y1]] = selection;
//         const x = xScale(commit.datetime);
//         const y = yScale(commit.hourFrac);
       
//         return x0 <= x && x <= x1 && y0 <= y && y <= y1;
//       }
    
//     function renderSelectionCount(selection, commits) {
//     const selectedCommits = selection
//         ? commits.filter((d) => isCommitSelected(selection, d))
//         : [];
    
//     const countElement = document.querySelector('#selection-count');
//     countElement.textContent = `${
//         selectedCommits.length || 'No'
//     } commits selected`;
    
//     return selectedCommits;
//     }
//     function renderLanguageBreakdown(selection) {
//         const selectedCommits = selection
//           ? commits.filter((d) => isCommitSelected(selection, d))
//           : [];
      
//         const container = document.getElementById('language-breakdown');
      

//         if (selectedCommits.length === 0) {
//           container.innerHTML = '';
//           return;
//         }
      

//         const lines = selectedCommits.flatMap((d) => d.lines);
  
//         const breakdown = d3.rollup(
//           lines,
//           (v) => v.length,
//           (d) => d.type
//         );
  
//         container.innerHTML = '';
      
//         const total = lines.length;

//         for (const [language, count] of breakdown) {
//           const proportion = count / total;
//           const formatted = d3.format('.1~%')(proportion);
//           container.innerHTML += `
//             <dt>${language}</dt>
//             <dd>${count} lines (${formatted})</dd>
//           `;
//         }
//       }


//     function brushed(event) {
//         const selection = event.selection;
   
//         d3.selectAll('circle').classed('selected', (d) =>
//           isCommitSelected(selection, d)
//         );

//         renderSelectionCount(selection, commits);
//         renderLanguageBreakdown(selection);
//       }

//       const brush = d3.brush()
//         .extent([
//           [usableArea.left, usableArea.top],
//           [usableArea.right, usableArea.bottom]
//         ])
//         .on('start brush end', brushed);
    
//       svg.call(brush);
//       svg.selectAll('.dots, .overlay ~ *').raise();

// }

// function updateScatterPlot(data, commits) {
//   const width = 1000;
//   const height = 600;
//   const margin = { top: 10, right: 10, bottom: 30, left: 20 };
//   const usableArea = {
//     top: margin.top,
//     right: width - margin.right,
//     bottom: height - margin.bottom,
//     left: margin.left,
//     width: width - margin.left - margin.right,
//     height: height - margin.top - margin.bottom,
//   };

//   const svg = d3.select('#chart').select('svg');

//   // 更新 scales 的 domain
//   xScale.domain(d3.extent(commits, (d) => d.datetime));

//   const [minLines, maxLines] = d3.extent(commits, (d) => d.totalLines);
//   const rScale = d3.scaleSqrt().domain([minLines, maxLines]).range([8, 35]);

//   const xAxis = d3.axisBottom(xScale);

//   // 清除并更新 X 轴 - 正确的方法
//   const xAxisGroup = svg.select('g.x-axis');
//   xAxisGroup.selectAll('*').remove(); // 清除旧的轴
//   xAxisGroup.call(xAxis)
//     .selectAll("text")
//     .attr("transform", "rotate(-30)")
//     .style("text-anchor", "end");

//   const dots = svg.select('g.dots');

//   const sortedCommits = d3.sort(commits, (d) => -d.totalLines);
  
//   // 使用正确的数据绑定和过渡
//   dots
//     .selectAll('circle')
//     .data(sortedCommits, d => d.id) // 添加 key 函数
//     .join(
//       enter => enter.append('circle')
//         .attr('cx', (d) => xScale(d.datetime))
//         .attr('cy', (d) => yScale(d.hourFrac))
//         .attr('r', 0)
//         .attr('fill', 'steelblue')
//         .style('fill-opacity', 0.4)
//         .call(enter => enter.transition().duration(500)
//           .attr('r', (d) => rScale(d.totalLines))
//         ),
//       update => update
//         .call(update => update.transition().duration(500)
//           .attr('cx', (d) => xScale(d.datetime))
//           .attr('cy', (d) => yScale(d.hourFrac))
//           .attr('r', (d) => rScale(d.totalLines))
//         ),
//       exit => exit
//         .call(exit => exit.transition().duration(300)
//           .attr('r', 0)
//           .remove()
//         )
//     )
//     .on('mouseenter', (event, commit) => {
//       d3.select(event.currentTarget).style('fill-opacity', 0.8);
//       renderTooltipContent(commit);
//       updateTooltipVisibility(true);
//       updateTooltipPosition(event);
//     })
//     .on('mousemove', (event) => {
//       updateTooltipPosition(event);
//     })
//     .on('mouseleave', (event) => {
//       d3.select(event.currentTarget).style('fill-opacity', 0.4);
//       updateTooltipVisibility(false);
//     });
// }


// document.getElementById("commit-progress")
//   .addEventListener("input", onTimeSliderChange);

// onTimeSliderChange();

// renderScatterPlot(data, commits);


import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7.9.0/+esm';

// 全局变量
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
    return d3
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

function onTimeSliderChange() {
    const slider = document.getElementById("commit-progress");
    commitProgress = +slider.value;

    commitMaxTime = timeScale.invert(commitProgress);

    document.getElementById("commit-time").textContent =
        commitMaxTime.toLocaleString("en-US", {
            dateStyle: "long",
            timeStyle: "short"
        });

    filteredCommits = commits.filter(d => d.datetime <= commitMaxTime);
    updateScatterPlot(data, filteredCommits);
    updateFileDisplay(filteredCommits);
}

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
        .range([8, 35]);

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

    commitMaxTime = timeScale.invert(commitProgress);
    filteredCommits = commits;

    document.getElementById("commit-progress")
        .addEventListener("input", onTimeSliderChange);

    // 初始化显示
    onTimeSliderChange();
    renderScatterPlot(data, commits);
    updateFileDisplay(filteredCommits);
}

// 启动应用
init();
