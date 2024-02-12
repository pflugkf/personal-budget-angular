import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {


  budgetData: any = [];

  constructor() {
    type ChartDataType = {
      title: string,
      budget: number
    }
  }
}
