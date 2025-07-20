import { Component, inject, ViewChild } from '@angular/core';
import { PostService } from '../../data/services/post.service';
import { Post } from '../../data/interfaces/post.interface';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-stats-page',
  imports: [NgChartsModule],
  templateUrl: './stats-page.component.html',
  styleUrl: './stats-page.component.scss'
})
export class StatsPageComponent {
  private postService = inject(PostService);

  @ViewChild('dateChart', { read: BaseChartDirective }) dateChart: BaseChartDirective | undefined;
  @ViewChild('userChart', { read: BaseChartDirective }) userChart: BaseChartDirective | undefined;
  @ViewChild('tagChart', { read: BaseChartDirective }) tagChart: BaseChartDirective | undefined;

  dateChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      {
        label: 'Posts per day',
        data: [],
        backgroundColor: '#E78A4E',
      },
    ],
  };

  dateChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  userChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      label: 'Posts per user',
      data: [],
      backgroundColor: '#E78A4E',
    }],
  };

  userChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  tagChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [{
      label: 'Posts per tag',
      data: [],
      backgroundColor: '#E78A4E',
    }],
  };

  tagChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  ngOnInit() {
    this.postService.getAllPosts().subscribe(posts => {
      const stats = this.getPostStats(posts);
      this.updateDateChartData(stats.byDate);
      this.updateUserChartData(stats.byUser);
      this.updateTagChartData(stats.byTag);
    });
  }

  updateDateChartData(stats: Record<string, number>) {
    this.dateChartData.labels = Object.keys(stats);
    this.dateChartData.datasets[0].data = Object.values(stats);
    this.dateChart?.update();
  }

  updateUserChartData(stats: Record<string, number>) {
    this.userChartData.labels = Object.keys(stats);
    this.userChartData.datasets[0].data = Object.values(stats);
    this.userChart?.update();
  }

  updateTagChartData(stats: Record<string, number>) {
    this.tagChartData.labels = Object.keys(stats);
    this.tagChartData.datasets[0].data = Object.values(stats);
    this.tagChart?.update();
  }

  getPostStats(posts: Post[]) {
    const byDate: Record<string, number> = {};
    const byUser: Record<string, number> = {};
    const byTag: Record<string, number> = {};
    
    for (const post of posts) {
      const date = new Date(post.timestamp).toISOString().split('T')[0];
      byDate[date] = (byDate[date] || 0) + 1;

      byUser[post.authorUsername] = (byUser[post.authorUsername] || 0) + 1;

      if (post.tags) {
        for (const tag of post.tags) {
          byTag[tag] = (byTag[tag] || 0) + 1;
        }
      }
    }

    return { byDate, byUser, byTag };
  }
}
