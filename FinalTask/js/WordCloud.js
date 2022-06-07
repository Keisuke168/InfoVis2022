class WordCloud{
    constructor(word){
        this.word = word;
        this.init();
    }

    init(){
        let self = this;
        self.year = 2017;
        self.layout = d3.layout.cloud()
        .size([600, 600])
        .words(self.word[self.year])
        .padding(5)
        .rotate(function() { return ~~(Math.random() * 2) * 90; })
        .font("Impact")
        .fontSize(function(d) { return d.size; })
        .on("end", self.draw);
    }

    update(year){
        d3.select('.cloud').select('svg').remove()
        let self = this;
        self.year = year;
        self.render()

    }

    render(){
        let self = this;
        // console.log(self.word[self.year])

        self.layout = d3.layout.cloud()
            .size([600, 600])
            .words(self.word[self.year])
            .padding(5)
            .rotate(function() { return ~~(Math.random() * 2) * 90; })
            .font("Impact")
            .fontSize(function(d) { return d.size; })
            .on("end", self.draw);

        self.layout.start();
    }

    draw(words) {
        let self = this;
        d3.select(".cloud").append("svg")
          .attr("width", 600)
          .attr("height", 600)
        .append("g")
          .attr("transform", "translate(" + 600 / 2 + "," + 600 / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
        }
}

