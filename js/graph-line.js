function drawLineGraph(graphData, maxValue, minValue, maxYear, minYear) {
   // グラフ描画用の配列データ
   var data = graphData;
   // グラフの最大値と最小値
   var ymax = maxValue;
   var ymin = minValue;
   var xmax = maxYear;
   var xmin = minYear;
   // グラフの横幅と高さ
   var gWidth = 650;
   var gHeight = 400;

   // グラフの余白
   var padding = 30;
   // x軸表示余白
   var xAxisPadding = 90;
   // y軸表示余白
   var yAxisPadding = 30;

   // 横軸の数
   var displayNum = xmax - xmin;
   // 1日分の横幅
   var dayWidth = (gWidth - xAxisPadding - padding * 2) / displayNum;

   // SVG作成
   var svg = d3.select('#mygraph').append('svg').attr('width', gWidth).attr('height', gHeight);

   // x軸
   var xScale = d3.scale
      .linear()
      .domain([xmin, xmax])
      .range([padding, gWidth - xAxisPadding - padding]);

   // y軸
   var yScale = d3.scale
      .linear()
      .domain([ymin, ymax])
      .range([gHeight - yAxisPadding, padding]);

   // x軸の定義
   var xAxis = d3.svg
      .axis()
      .scale(xScale)
      .orient('bottom')
      .tickFormat(function (d) {
         return d + '年';
      }); // 数字+年

   // y軸の定義
   var yAxis = d3.svg.axis().scale(yScale).orient('left');

   // x軸を追加します
   svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + xAxisPadding + ', ' + (gHeight - yAxisPadding) + ')')
      .call(xAxis)
      .selectAll('text');

   // y軸を追加します
   svg.append('g')
      .attr('class', 'axis')
      .attr('transform', 'translate(' + xAxisPadding + ', 0)')
      .call(yAxis);

   // 折れ線グラフのアニメーション開始位置
   var line_start = d3.svg
      .line()
      .x(function (d, i) {
         return (d[0] - xmin) * dayWidth + xAxisPadding + padding;
      })
      .y(function (d) {
         return gHeight - yAxisPadding;
      });
   // 折れ線グラフのアニメーション終了位置
   var line_end = d3.svg
      .line()
      .x(function (d, i) {
         return (d[0] - xmin) * dayWidth + xAxisPadding + padding;
      })
      .y(function (d) {
         return yScale(d[1]);
      });
   // 折れ線グラフを追加し、アニメーションを開始します
   svg.append('path')
      .attr('class', 'high')
      .attr('d', line_start(data))
      .attr('stroke', '#ed5454')
      .attr('stroke-width', '2px')
      .attr('fill', 'none')
      .transition()
      .delay(1000)
      .duration(1000)
      .attr('d', line_end(data));

   // 丸印を追加します
   svg.selectAll('.high_circle')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'high_circle')
      .attr('cx', function (d, i) {
         return (d[0] - xmin) * dayWidth + xAxisPadding + padding;
      })
      .attr('cy', function (d) {
         return yScale(d[1]);
      })
      .attr('r', 0)
      .attr('stroke', '#ed5454')
      .attr('stroke-width', '1px')
      .attr('fill', '#f8d7d7')
      .transition()
      .delay(2000)
      .duration(800)
      .attr('r', 4);

   // テキストを追加します
   svg.selectAll('.high_text')
      .data(data)
      .enter()
      .append('text')
      .transition()
      .delay(2800)
      .attr('class', 'high_text')
      .text(function (d) {
         return String(d[1]).replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + '人';
      })
      .attr('font-size', '11px')
      .attr('fill', '#ed5454')
      .attr('x', function (d, i) {
         return (d[0] - xmin) * dayWidth + xAxisPadding + padding - 40;
      })
      .attr('y', function (d) {
         return yScale(d[1]) + 20;
      });

   // グラフ目盛り（横線）を追加します
   svg.append('g').attr('class', 'axis').attr('id', 'scale');
   // 本数分ループ
   for (i = 0; i <= 10; i++) {
      var scaledata1 = [xAxisPadding, ((gHeight - yAxisPadding - padding) / 10) * i + padding];
      var scaledata2 = [gWidth - padding, ((gHeight - yAxisPadding - padding) / 10) * i + padding];
      var scaledata = [scaledata1, scaledata2];
      // 横線のアニメーション開始位置
      var scale_start = d3.svg
         .line()
         .x(function (d) {
            return d[0];
         })
         .y(function (d) {
            return gHeight - yAxisPadding;
         });
      // 横線のアニメーション終了位置
      var scale_end = d3.svg
         .line()
         .x(function (d) {
            return d[0];
         })
         .y(function (d) {
            return d[1];
         });
      // 横線を追加しアニメーションを開始します
      svg.selectAll('#scale')
         .append('path')
         .attr('id', 'mem' + i)
         .attr('d', scale_start(scaledata))
         .attr('fill', 'none')
         .transition()
         .delay(250 + i * 25)
         .duration(1000)
         .attr('d', scale_end(scaledata));
   }
}
