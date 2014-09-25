
Template.wordcloud.rendered = function() {
  var w          = 960,
      h          = 600,
      svg        = d3.select("svg"),
      background = svg.append("g"),
      vis        = svg.append("g")
          .attr("transform", "translate(" + [w >> 1, h >> 1] + ")"),
      words      = [],
      scale      = 1,
      fill       = d3.scale.category20(),
      steps      = 10,
      from       = -75,
      to         = 75,
      fontSize;

  var layout = d3.layout.cloud()
    .size([w, h])
    .timeInterval(10)
    .text(function(d) { return d.text; })
    .fontSize(function(d) { return Math.abs(fontSize(+d.size)); })
    .padding(1)
    .on("end", draw);

    Tracker.autorun(function() {
      WordCloud.find().rewind();
      var wordArray = _.sortBy(_.map(WordCloud.find().fetch(), function(d) {
        return {text: d.word, size: d.frequency};
      }), function(word) { return -word.size; }) ;
      generateCloud(wordArray);
    });

  function generateCloud(wordArray) {
    fontSize = d3.scale.log().range([16, 100]);
    words = [];
    layout.stop();
    fontSize.domain([+wordArray[wordArray.length - 1].size || 1, +wordArray[0].size]);
    layout.words(wordArray);
    layout.start();
  }

  function draw(data, bounds) {
    words = data;
    var text = vis.selectAll("text")
    .data(words, function(d) { return d.text.toLowerCase(); });

    text
      .transition()
        .duration(1000)
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate +")";
        })
        .style("font-size", function(d) {
          return d.size + "px";
        });

    text.enter().append("text")
        .attr("text-anchor", "middle")
        .attr("transform", function(d) {
          return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
        })
        .style("font-size", function(d) { return d.size + "px"; })
        .style("opacity", 1e-6)
      .transition()
        .duration(1000)
        .style("opacity", 1);

    text.style("font-family", function(d) { return d.font; })
      .style("fill", function(d) {
        return fill(d.text.toLowerCase());
      })
      .text(function(d) { return d.text; });

    var exitGroup = background.append("g")
      .attr("transform", vis.attr("transform"));
    var exiGroupNode = exitGroup.node();

    text.exit().each(function() {
      exitGroupNode.appendChild(this);
    });

    exitGroup.transition()
      .duration(1000)
      .style("opacity", 1e-6)
      .remove();
    vis.transition()
      .delay(1000)
      .duration(750)
      .attr("transform", "translate(" +
           [w >> 1, h >> 1] +
           ") scale(" + scale + ")");
  }

  (function() {
    layout.rotate(function() {
      return ~~(Math.random() * steps) * 90;
    });
  })();
};
