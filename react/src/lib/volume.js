import d3 from 'd3';

// `imgUrl` can be null and the circle will use `opts.bgColor`
//
// Supported option properties:
//  size: 185 -> the width and height
//  lineWidth: 8 -> the width of the volume path
//  bgColor: '#fff' -> colour behind the volume path and avatar image
//  startColor: '#f3ff74' -> start of the volume path gradient
//  endColor: '#ff8500' -> end of the volume path gradient
//  class: 'volumeAvatar' -> CSS class name
var createVolumeAvatar = function(imgUrl, opts) {
  opts = opts || {};

  // track # of times this func is invoked so we can number our css identifier
  createVolumeAvatar.count = createVolumeAvatar.count || 1;

  var selector = opts.selector || 'body',
    width = opts.size || 185,
    height = opts.size || 185,
    lineWidth = opts.lineWidth || 8,
    radius = (Math.min(width, height) / 2) - lineWidth,
    twoPI = 2 * Math.PI,
    bgColor = opts.bgColor || '#fff',
    startColor = opts.startColor || '#f3ff74',
    endColor = opts.endColor || '#ff8500',
    cls = opts.class || 'volumeAvatar';

  var arc = d3.svg.arc()
    .startAngle(1 * Math.PI)
    .innerRadius(radius - (lineWidth / 2))
    .outerRadius(radius + (lineWidth / 2));

  var svg = d3.select(selector)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("class", cls)
    .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

  var background = svg.append("circle")
    .attr("stroke", bgColor)
    .attr("stroke-width", lineWidth)
    .attr("r", radius);

  if (imgUrl) {
    var patternId = "venus-"+createVolumeAvatar.count;

    svg.append("defs")
      .append("pattern")
      .attr("id", patternId)
      .attr("patternUnits", "userSpaceOnUse")
      .attr("x", width / 2)
      .attr("y", height / 2)
      .attr("width", width)
      .attr("height", height)
      .append("image")
      .attr("xlink:href", imgUrl)
      .attr("width", width)
      .attr("height", height);

    background.attr("fill", "url(#"+patternId+")");
    createVolumeAvatar.count++;
  } else {
    background.attr("fill", bgColor);
  }

  var meter = svg.append("g");
  var foreground = meter.append("path");
  var gradient = svg.append("svg:defs")
    .append("svg:linearGradient")
    .attr("id", "gradient")
    .attr("x1", "0%")
    .attr("y1", "0%")
    .attr("x2", "100%")
    .attr("y2", "100%")
    .attr("spreadMethod", "pad");

  gradient.append("svg:stop")
    .attr("offset", "0%")
    .attr("stop-color", startColor)
    .attr("stop-opacity", 1);

  gradient.append("svg:stop")
    .attr("offset", "100%")
    .attr("stop-color", endColor)
    .attr("stop-opacity", 1);

  foreground
    .datum({
      endAngle: 1 * Math.PI
    })
    .attr("cx", 100)
    .attr("fill", "url(#gradient)");

  // Return a function the user can call to change volume.
  // Use transition.call (identical to selection.call) so that we can
  // encapsulate the logic for tweening the arc in a separate function below.
  return function(volume) {
    foreground.transition()
      .duration(25)
      .call(arcTween, Math.PI + Math.PI * volume);
  };

  // Creates a tween on the specified transition's "d" attribute, transitioning
  // any selected arcs from their current angle to the specified new angle.
  // See: http://bl.ocks.org/mbostock/5100636
  function arcTween(transition, newAngle) {
    transition.attrTween("d", function(d) {
      var interpolate = d3.interpolate(d.endAngle, newAngle);

      return function(t) {
        d.endAngle = interpolate(t);
        return arc(d);
      };
    });
  }
}

module.exports = {
  createVolumeAvatar
}
