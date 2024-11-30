import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import * as d3 from 'd3';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  data: any[] = [];  // The data fetched from API
  private svg: any;
  private margin = 40;
  private width = 500;
  private height = 500;

  constructor() { }

  ngOnInit(): void {
    this.fetchInvestmentData();
  }

  // Fetch investment data from the API for the report page
  fetchInvestmentData(): void {
    const token = localStorage.getItem('token');  // Retrieve the token from localStorage

    if (!token) {
      console.error('No token found');
      return;
    }

    axios.get('http://localhost:3000/api/greenHydrogenInvestment', {
      headers: {
        'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
      }
    }).then((response) => {
        this.data = response.data;
        console.log(this.data);
        this.createSvg();
        this.drawPieChart(this.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          // Show an alert if the status is 401
          alert('Token Expired. Please log in again.');
          localStorage.removeItem('token');
          window.location.href = '/'; 
        }
        console.error('Error fetching investment data:', error);
      });
  }

  private createSvg(): void {
    this.svg = d3.select('figure#bar')
      .append('svg')
    .attr('width', this.width)
    .attr('height', this.height)
    .append('g')
    .attr('transform', `translate(${this.width / 2}, ${this.height / 2})`)
    // 

    d3.select('svg')
    .append('text')
    .attr('x', this.width / 2) // Center the title horizontally
    .attr('y', this.margin / 2) // Position the title vertically above the chart
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .style('font-weight', 'bold')
    .text('Investment in Green Hydrogen by Country');
  }

  private drawPieChart(data: any[]): void {
    
    const pie = d3.pie().value((d: any) => d); 
    const radius = Math.min(this.width, this.height) / 2 - this.margin;

    const arc = d3.arc()
    .outerRadius(radius)  
    .innerRadius(0);       

    const pieData = this.data.map(d => d.investment_amount);
    const pieDataFormatted = pie(pieData); 
    const color = d3.scaleOrdinal(d3.schemeCategory10);

    this.svg.selectAll('path')
      .data(pieDataFormatted)
      .enter().append('path')
      .attr('d', (d: any) => arc(d)) 
      .attr('fill', (d: any, i: any) => color(i)) 
      .attr('stroke', '#fff')
      .attr('stroke-width', 1.5);

    const labelArc = d3.arc()
      .outerRadius(radius - 40)  
      .innerRadius(radius - 40);

    this.svg.selectAll('text')
      .data(pieDataFormatted)
      .enter().append('text')
      .attr('transform', (d: any) => `translate(${labelArc.centroid(d)})`)
      .attr('dy', '.35em')
      .text((d: any) => {
        const country = this.data[d.index].country;
        const investment = this.data[d.index].investment_amount;
        return `${country}: ${investment}`; // Label with country and value
      })  
      .style('text-anchor', 'middle')
      .style('font-size', '14px')
      .style('font-weight', 'bold');
  }
}
