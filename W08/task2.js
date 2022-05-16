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
        };

        let line_chart = new LineChart(config, data);
        line_chart.update();

    })
    .catch(error => {
        console.log(error);
    });

class LineChart {
    constructor(config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || { top: 20, right: 20, bottom: 20, left: 20 },
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;
        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

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

        //Initialize line
        self.line = d3.line()
            .x(d => self.xscale(d.x))
            .y(d => self.yscale(d.y));

        //Initialize Area
        self.area = d3.area()
            .x(d => self.xscale(d.x))
            .y1(d => self.yscale(d.y))
            .y0(self.yscale(0));
    }

    update() {
        let self = this;
        const xmax = d3.max(self.data, d => d.x);
        const ymax = d3.max(self.data, d => d.y);

        self.xscale
            .domain([0, xmax]);
        self.yscale
            .domain([0, ymax]);

        self.render();
    }

    render() {
        let self = this;
        let title = "Task2 : Line Chart";

        //Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call(self.xaxis)
            .append('text')
            .text('X')
            .attr('x', self.inner_width / 2)
            .attr('y', self.config.margin.bottom)
            .attr("font-size", "18px")
            .attr("fill", "black")
            .attr('text-anchor', 'middle')
            .attr("stroke-width", 1);

        self.yaxis_group = self.chart.append('g')
            .call(self.yaxis)
            .append('text')
            .text('Y')
            .attr('x', -self.inner_height / 2)
            .attr('y', -self.config.margin.left / 2)
            .attr("font-size", "18px")
            .attr("fill", "black")
            .attr('transform', 'rotate(-90)')
            .attr('text-anchor', 'middle')
            .attr("stroke-width", 1);

        self.chart_title = self.chart.append('g')
            .attr('id', 'chart_title')

        // Draw line
        self.chart.append('path')
            .attr('d', self.line(self.data))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Draw area
        self.chart.append('path')
            .attr('d', self.area(self.data))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('fill', '#ffe5ff');

        // Draw dots
        self.chart.selectAll('circle')
            .data(self.data)
            .enter()
            .append('circle')
            .attr('cx', d => self.xscale(d.x))
            .attr('cy', d => self.yscale(d.y))
            .attr('r', 5)
            .style('fill', d => d.c)
            .attr('stroke', 'black')
            .attr('stroke-width', 1.5);

        self.svg.select('#chart_title')
            .append('text')
            .attr('font-size', '22px')
            .attr('font-weight', 'bold')
            .text(title)
            .attr('transform', `translate(${(self.inner_width - title.length * 18) / 2}, ${self.config.margin.top})`);
    }
}
