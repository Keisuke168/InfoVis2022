d3.csv("https://keisuke168.github.io/InfoVis2022/W08/w08.csv")
    .then(data => {
        data.forEach(d => {
            d.label = d.label;
            d.value = +d.value;
            d.i = d.i;
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
        
        let bar_chart = new BarChart(config, data);
        bar_chart.update();
    })
    .catch(error => {
        console.log(error);
    });

class BarChart {
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

        //Init axis scales
        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([self.config.margin.top_title, self.inner_height]);


        //Init axes
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
    }

    update() {
        let self = this;
        const xmax = d3.max(self.data, d => d.value);

        self.xscale
            .domain([0, xmax])
        self.yscale
            .domain(self.data.map(d => d.label))
            .paddingInner(0.1);

        self.render();
    }

    render() {
        let self = this;
        let title = "Task1 : BarPlot";

        //Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call(self.xaxis);

        self.yaxis_group = self.chart.append('g')
            .call(self.yaxis);

        self.chart_title = self.chart.append('g')
            .attr('id', 'chart_title')

        // Draw bars
        self.chart.selectAll("rect").data(self.data).enter()
            .append("rect")
            .attr("x", 0)
            .attr("y", d => self.yscale(d.label))
            .attr("fill", d => d.c)
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("width", d => self.xscale(d.value))
            .attr("height", self.yscale.bandwidth());

        self.svg.select('#chart_title')
            .append('text')
            .attr('font-size', '22px')
            .attr('font-weight', 'bold')
            .text(title)
            .attr('transform', `translate(${(self.inner_width / 2 - title.length) / 2}, ${self.config.margin.top})`);
    }
}
