import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'pb-d3pie',
  templateUrl: './d3pie.component.html',
  styleUrl: './d3pie.component.css'
})
export class D3pieComponent implements OnInit {
  @ViewChild('pieChart', { static: true })
  chartRef!: ElementRef;

  constructor(private elementRef: ElementRef, private renderer2: Renderer2) {

  }

  private backgroundColors = ["#ffcd56", "#ff6384", "#36a2eb", "#fd6b19", "#99ff66", "#cc33ff", "#b3b3b3"];
  private labels: any = [];
  private values: any = [];

  private ctx: any;
  private svg: any;
  private width = 270;//960
  private height = 142.5;//450
  private radius = Math.min(this.width, this.height) / 2;

  private createSVG(): void {
    this.chartRef = this.elementRef;
    this.ctx = this.elementRef.nativeElement.querySelector(`#pieChart`);

    this.svg = d3.select(this.ctx)
      .append("svg")
      .append("g");

    this.svg.append("g")
      .attr("class", "slices");
    this.svg.append("g")
      .attr("class", "labels");
    this.svg.append("g")
      .attr("class", "lines");
  }

  ngOnInit(): void {
    this.createSVG();

    d3.json('http://localhost:3000/budget').then((data: any) => {

      const budgetArray = data.myBudget;
      for (let i = 0; i < budgetArray.length; i++) {
        this.labels.push(budgetArray[i].title);
        this.values.push(budgetArray[i].budget);
      }

      var pie = d3.pie()
        .sort(null)
        .value(function (d: any) {
          return d.budget;
        });

      var arc = d3.arc()
        .outerRadius(this.radius * 0.8)
        .innerRadius(this.radius * 0.4);

      var outerArc = d3.arc()
        .innerRadius(this.radius * 0.9)
        .outerRadius(this.radius * 0.9);

      this.svg.attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");

      var key = function (d: any) {
        return d.data.title;
      };

      var color = d3.scaleOrdinal()
        .domain(this.labels)
        .range(this.backgroundColors);

      const change = (data:any) => {

        //------- PIE SLICES -------
        var slice = this.svg.select(".slices").selectAll("path.slice")
          .data(pie(data), key);

        slice.enter()
          .insert("path")
          .style("fill", function (d:any) {return color(d.data.title);})
          .attr("class", "slice")
          .transition().duration(1000)
          .attrTween("d",  (d:any, i:any, n:any) => {
            d3.select(n[i]).node()._current = d3.select(n[i]).node()._current || d;
            var interpolate = d3.interpolate(d3.select(n[i]).node()._current, d);
            d3.select(n[i]).node()._current = interpolate(0);
            return function (t:any) {
              return arc(interpolate(t));
            };
          });

        /* slice.transition().duration(1000)
        .attrTween("d",  (d:any, i:any, n:any) => {
          d3.select(n[i]).node()._current = d3.select(n[i]).node()._current || d;
          var interpolate = d3.interpolate(d3.select(n[i]).node()._current, d);
          d3.select(n[i]).node()._current = interpolate(0);
          return function (t:any) {
            return arc(interpolate(t));
          };
        }); */

        slice.exit()
          .remove();

        //------- TEXT LABELS -------

        var text = this.svg.select(".labels").selectAll("text")
          .data(pie(data), key);

        text.enter()
          .append("text")
          .attr("dy", ".35em")
          .text(function (d:any) {
            return d.data.title;
          }).transition().duration(1000)
          .attrTween("transform",  (d:any, i:any, n:any) => {
            d3.select(n[i]).node()._current = d3.select(n[i]).node()._current || d;
            var interpolate = d3.interpolate(d3.select(n[i]).node()._current, d);
            d3.select(n[i]).node()._current = interpolate(0);
            return  (t:any) => {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = this.radius * (midAngle(d2) < Math.PI ? 1 : -1);
              return "translate(" + pos + ")";
            };
          })
          .styleTween("text-anchor",  (d:any, i:any, n:any) => {
            d3.select(n[i]).node()._current = d3.select(n[i]).node()._current || d;
            var interpolate = d3.interpolate(d3.select(n[i]).node()._current, d);
            d3.select(n[i]).node()._current = interpolate(0);
            return function (t:any) {
              var d2 = interpolate(t);
              return midAngle(d2) < Math.PI ? "start" : "end";
            };
          });

        function midAngle(d:any) {
          return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }

        /* text.transition().duration(1000)
          .attrTween("transform",  (d:any, i:any, n:any) => {
            d3.select(n[i]).node()._current = d3.select(n[i]).node()._current || d;
            var interpolate = d3.interpolate(d3.select(n[i]).node()._current, d);
            d3.select(n[i]).node()._current = interpolate(0);
            return  (t:any) => {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = this.radius * (midAngle(d2) < Math.PI ? 1 : -1);
              return "translate(" + pos + ")";
            };
          })
          .styleTween("text-anchor",  (d:any, i:any, n:any) => {
            d3.select(n[i]).node()._current = d3.select(n[i]).node()._current || d;
            var interpolate = d3.interpolate(d3.select(n[i]).node()._current, d);
            d3.select(n[i]).node()._current = interpolate(0);
            return function (t:any) {
              var d2 = interpolate(t);
              return midAngle(d2) < Math.PI ? "start" : "end";
            };
          }); */

        text.exit()
          .remove();

        //------- SLICE TO TEXT POLYLINES -------

        var polyline = this.svg.select(".lines").selectAll("polyline")
          .data(pie(data), key);

        polyline.enter()
          .append("polyline").transition().duration(1000)
          .attrTween("points",  (d:any, i:any, n:any) => {
            d3.select(n[i]).node()._current = d3.select(n[i]).node()._current || d;
            var interpolate = d3.interpolate(d3.select(n[i]).node()._current, d);
            d3.select(n[i]).node()._current = interpolate(0);
            return  (t:any) => {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = this.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
              return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
          });

        /* polyline.transition().duration(1000)
          .attrTween("points",  (d:any, i:any, n:any) => {
            d3.select(n[i]).node()._current = d3.select(n[i]).node()._current || d;
            var interpolate = d3.interpolate(d3.select(n[i]).node()._current, d);
            d3.select(n[i]).node()._current = interpolate(0);
            return  (t:any) => {
              var d2 = interpolate(t);
              var pos = outerArc.centroid(d2);
              pos[0] = this.radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
              return [arc.centroid(d2), outerArc.centroid(d2), pos];
            };
          }); */

        polyline.exit().remove();
      };

      change(budgetArray);
    });

  }

}
