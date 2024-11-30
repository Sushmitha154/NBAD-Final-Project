import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import axios from 'axios';
import * as d3 from 'd3';

@Component({
  selector: 'pb-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {
  data: any[] = [];  // The data fetched from API
  @ViewChild('scatterChart', { static: true }) private chartContainer: ElementRef | undefined;
  
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

    axios.get('http://localhost:3000/api/patentFilings', {
      headers: {
        'Authorization': `Bearer ${token}`  // Attach the token in the Authorization header
      }
    }).then((response) => {
      this.data = response.data;
      console.log(this.data);
      this.createBarChart();  // Call to create the pie chart after data is fetched
    })
    .catch((error) => {
      if (error.response && error.response.status === 401) {
        alert('Token Expired. Please log in again.');
        localStorage.removeItem('token');
        window.location.href = '/'; 
      }
      console.error('Error fetching investment data:', error);
    });
  }

 
createBarChart(): void {
  const margin = 40;
  const width = 600 - margin * 2;
  const height = 400 - margin * 2;

  const svg = d3.select(this.chartContainer?.nativeElement)  
  .append('svg')
      .attr('width', width + margin * 2)
      .attr('height', height + 20 + margin * 2)
      .append('g')
      .attr('transform', `translate(${margin}, ${margin})`);
    
    const x = d3.scaleBand()
      .range([0, width])
      .domain(this.data.map(d => d.country))  
      .padding(0.2);

    svg.append('g')
      .attr('transform', `translate(0, ${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('text-anchor', 'end');

      d3.select('svg')
      .append('text')
      .attr('x', width / 2) // Center the title horizontally
      .attr('y', margin / 2) // Position the title vertically above the chart
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Patent Count by Country');
    // Create the Y-axis scale (investment amount)
    const y = d3.scaleLinear()
    .domain([0, d3.max(this.data, (d: any) => d.patent_count)]) 
    .range([height, 0]);

    svg.append('g')
      .call(d3.axisLeft(y));

    // Create and fill the bars
    svg.selectAll('bars')
      .data(this.data)
      .enter()
      .append('rect')
      .attr('x', (d: { country: string }) => x(d.country) || 0) 
      .attr('y', (d: { patent_count: number }) => y(d.patent_count))
      .attr('width', x.bandwidth())
      .attr('height', (d: { patent_count: number }) => height - y(d.patent_count))
      .attr('fill', '#4d5791');
    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -28)  // Adjust to position the label properly
      .attr('x', -height / 2)  // Center the label vertically
      .style('text-anchor', 'middle')
      .text('Patent Count');

  }

}
