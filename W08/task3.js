d3.csv("https://keisuke168.github.io/InfoVis2022/W08/w08.csv")
    .then(data => {
        data.forEach(d => {
            d.label = d.label;
            d.value = +d.value;
            d.i = d.i
            d.x = +d.x;
            d.y = +d.y;
            d.r = +d.r;
            d.c = d.c;
        })

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: { top: 20, right: 20, bottom: 40, left: 80, top_title: 30 },
            innerRadius: 10,
        };

        const inputSliderBarElement = document.getElementById('inputSlideBar');

        let piechart = new PieChart(config, data);
        piechart.update();

        inputSliderBarElement.addEventListener('change', function() {
            piechart.config.innerRadius = Math.min((config.width - config.margin.left - config.margin.top_title) / 2.2, inputSliderBarElement.value * 2);
            piechart.update();
        });
    })
    .catch(error => {
        console.log(error);
    });


class PieChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 20, right: 20, bottom: 20, left: 20 },
            innerRadius: config.innerRadius || 10,
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.outerRadius = Math.min(self.inner_height, self.inner_width) / 2.2;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`)

        //Initialize axis scales
        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleLinear()
            .range([self.inner_height, self.config.margin.top_title]);

        //Initialize axes
        self.xaxis = d3.axisBottom(self.xscale)
            .ticks(5)
            .tickSize(4)
            .tickPadding(8)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft(self.yscale)
            .ticks(5)
            .tickSize(4)
            .tickPadding(8)
            .tickSizeOuter(0);

        self.pie = d3.pie()
            .value(d => d.value);

        self.arc = d3.arc()
            .innerRadius(self.config.innerRadius)
            .outerRadius(self.outerRadius);
    }

    update() {
        let self = this;
        const xmax = d3.max(self.data, d => d.x);
        const ymax = d3.max(self.data, d => d.y);

        self.xscale
            .domain([0, xmax]);
        self.yscale
            .domain([0, ymax]);

        self.arc.innerRadius(self.config.innerRadius);
        self.chart.selectAll("path").remove();
        self.chart.selectAll("text").remove();
        self.render();
    }

    render() {
        let self = this;
        let title = "Task3 : Pie Chart";

        self.chart_title = self.chart.append('g')
            .attr('id', 'chart_title')

        self.pieChart = self.chart.selectAll('pie')
            .data(self.pie(self.data))
            .enter()
            .append('g')

        // Draw Pie
        self.pieChart
            .append('path')
            .attr('d', self.arc)
            .attr('fill', d => d.data.c)
            .attr('stroke', 'black')
            .attr('stroke-width', 1)
            .attr('transform', `translate(${self.inner_width / 2}, ${self.inner_height / 2})`)


        // Draw labels
        const label_size = 18;
        self.pieChart
            .append('text')
            .attr('transform', d => `translate(${self.arc.centroid(d)[0] + self.inner_width / 2}, ${self.arc.centroid(d)[1] + self.inner_height / 2})`)
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('font-size', label_size)
            .attr('font-weight', 'bold')
            .text(d => d.data.label);

        //Draw values
        self.pieChart
            .append('text')
            .attr('transform', d => `translate(${self.arc.centroid(d)[0] + self.inner_width / 2}, ${self.arc.centroid(d)[1] + self.inner_height / 2 + label_size + 1})`)
            .attr('dy', '.35em')
            .style('text-anchor', 'middle')
            .attr('fill', 'black')
            .attr('font-size', label_size)
            .attr('font-weight', 'bold')
            .text(d => d.data.value);


        self.svg.select('#chart_title')
            .append('text')
            .attr('font-size', '22px')
            .attr('font-weight', 'bold')
            .text(title)
            .attr('transform', `translate(${(self.inner_width - title.length * 18) / 2}, ${self.config.margin.top})`);
    }
}
