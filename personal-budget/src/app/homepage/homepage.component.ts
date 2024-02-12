import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'pb-homepage',
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  @ViewChild('myChart', { static: true })
  chartRef!: ElementRef;
  chart!: Chart;
  constructor(private http: HttpClient, private elementRef: ElementRef) {

  }

  public dataSource = {
    datasets: [
        {
            data: [``],
            backgroundColor: [
                '#ffcd56',
                '#ff6384',
                '#36a2eb',
                '#fd6b19',
                '#99ff66',
                '#cc33ff',
                '#b3b3b3'
            ]
        }
    ],
    labels: [``]
};

  ngOnInit(): void {
    this.http.get('http://localhost:3000/budget')
    .subscribe((res: any) => {
      for (var i = 0; i < res.myBudget.length; i++) {
        this.dataSource.datasets[0].data[i] = res.myBudget[i].budget;
        this.dataSource.labels[i] = res.myBudget[i].title;
        //this.createChart();
      }
      this.createChart();
    });
  }

  createChart() {
    const ctx = this.elementRef.nativeElement.querySelector(`#myChart`);

    const myPieChart = new Chart(ctx, {
        type: 'pie',
        data: this.dataSource
    });
}

}
