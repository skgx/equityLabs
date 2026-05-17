import { Component, Input, OnChanges, SimpleChanges, ElementRef, ViewChild, AfterViewInit, OnDestroy, HostListener, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { createChart, IChartApi, ISeriesApi, CandlestickData, Time, ColorType, CandlestickSeries } from 'lightweight-charts';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-stock-chart',
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule],
  template: `
    <div class="chart-wrapper">
      <div #chartContainer class="chart-container"></div>
      <div class="loading-overlay" *ngIf="isLoading()">
        <mat-spinner diameter="40"></mat-spinner>
      </div>
      <div class="error-overlay" *ngIf="error()">
        <p>{{ error() }}</p>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
      height: 100%;
    }
    .chart-wrapper {
      position: relative;
      width: 100%;
      height: 100%;
      background-color: #0c1015;
    }
    .chart-container {
      width: 100%;
      height: 100%;
    }
    .loading-overlay, .error-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background: rgba(12, 16, 21, 0.85);
      z-index: 10;
      gap: 12px;
    }
    .error-overlay p {
      color: #EF4444;
      font-size: 14px;
      font-family: 'Inter', sans-serif;
      margin: 0;
    }
  `]
})
export class StockChartComponent implements AfterViewInit, OnChanges, OnDestroy {
  @ViewChild('chartContainer') chartContainer!: ElementRef;
  @Input() symbol: string = 'RELIANCE.NS';
  @Input() range: string = '1mo';
  @Input() interval: string = '1d';

  private chart: IChartApi | null = null;
  private candleSeries: ISeriesApi<'Candlestick'> | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private http = inject(HttpClient);

  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);

  private proxyUrl = `${environment.apiUrl}/api/market-proxy/chart`;

  ngAfterViewInit(): void {
    // Delay initialization slightly to ensure container dimensions are ready
    setTimeout(() => {
      this.initChart();
      this.setupResizeObserver();
      this.loadData();
    }, 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['symbol'] || changes['range'] || changes['interval']) && this.chart) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.remove();
    }
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.triggerResize();
  }

  private triggerResize() {
    if (this.chart && this.chartContainer) {
      const { clientWidth, clientHeight } = this.chartContainer.nativeElement;
      if (clientWidth > 0 && clientHeight > 0) {
        this.chart.applyOptions({
          width: clientWidth,
          height: clientHeight
        });
        this.chart.timeScale().fitContent();
      }
    }
  }

  private setupResizeObserver() {
    if (!this.chartContainer) return;

    this.resizeObserver = new ResizeObserver(() => {
      // Use requestAnimationFrame to throttle resize calls during smooth drag
      requestAnimationFrame(() => this.triggerResize());
    });

    this.resizeObserver.observe(this.chartContainer.nativeElement);
  }

  private initChart() {
    if (!this.chartContainer) return;
    
    const chartOptions = {
      layout: {
        background: { type: ColorType.Solid, color: '#0c1015' },
        textColor: '#9CA3AF',
      },
      grid: {
        vertLines: { color: 'rgba(255, 255, 255, 0.05)' },
        horzLines: { color: 'rgba(255, 255, 255, 0.05)' },
      },
      width: this.chartContainer.nativeElement.clientWidth || 600,
      height: this.chartContainer.nativeElement.clientHeight || 400,
      timeScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
        timeVisible: true,
        secondsVisible: false,
      },
      rightPriceScale: {
        borderColor: 'rgba(255, 255, 255, 0.1)',
      },
    };

    this.chart = createChart(this.chartContainer.nativeElement, chartOptions);
    this.candleSeries = this.chart.addSeries(CandlestickSeries, {
      upColor: '#10B981',
      downColor: '#EF4444',
      borderVisible: false,
      wickUpColor: '#10B981',
      wickDownColor: '#EF4444',
    });
  }

  loadData() {
    if (!this.symbol) return;
    this.isLoading.set(true);
    this.error.set(null);

    const yahooSymbol = this.symbol.includes('.NS') ? this.symbol : `${this.symbol}.NS`;
    const url = `${this.proxyUrl}/${yahooSymbol}?range=${this.range}&interval=${this.interval}`;

    this.http.get(url).subscribe({
      next: (res: any) => {
        try {
          const data = typeof res === 'string' ? JSON.parse(res) : res;
          
          if (!data.chart || !data.chart.result || data.chart.error) {
            throw new Error(data.chart?.error?.description || 'Symbol not found');
          }
          
          const result = data.chart.result[0];
          const timestamps = result.timestamp;
          const ohlc = result.indicators.quote[0];

          if (!timestamps || !ohlc.open) throw new Error('No historical data');

          const candleData: CandlestickData<Time>[] = [];
          for (let i = 0; i < timestamps.length; i++) {
            if (ohlc.open[i] != null && ohlc.high[i] != null && ohlc.low[i] != null && ohlc.close[i] != null) {
              candleData.push({
                time: timestamps[i] as Time,
                open: ohlc.open[i],
                high: ohlc.high[i],
                low: ohlc.low[i],
                close: ohlc.close[i],
              });
            }
          }

          if (this.candleSeries && candleData.length > 0) {
            this.candleSeries.setData(candleData);
            setTimeout(() => {
              if (this.chart) this.chart.timeScale().fitContent();
            }, 50);
          } else {
            throw new Error('No valid price data');
          }
          this.isLoading.set(false);
        } catch (e: any) {
          console.warn(`Data parsing failed for ${this.symbol}:`, e.message);
          this.handleLoadError();
        }
      },
      error: (err) => {
        console.warn(`API request failed for ${this.symbol} via backend proxy`, err.status);
        this.handleLoadError();
      }
    });
  }

  private handleLoadError() {
    this.error.set('Historical Data unavailable');
    this.loadMockData();
  }

  private loadMockData() {
    this.isLoading.set(false);
    const candleData: CandlestickData<Time>[] = [];
    let prevClose = this.symbol.includes('RELIANCE') ? 2950 : 1500;
    const now = Math.floor(Date.now() / 1000);
    const day = 24 * 60 * 60;
    const count = this.range === '1d' ? 78 : 30;

    for (let i = count; i >= 0; i--) {
      const open = prevClose + (Math.random() - 0.5) * (prevClose * 0.01);
      const close = open + (Math.random() - 0.5) * (prevClose * 0.02);
      const high = Math.max(open, close) + Math.random() * (prevClose * 0.005);
      const low = Math.min(open, close) - Math.random() * (prevClose * 0.005);
      
      candleData.push({
        time: (now - i * (this.range === '1d' ? 300 : day)) as Time,
        open, high, low, close
      });
      prevClose = close;
    }

    if (this.candleSeries) {
      this.candleSeries.setData(candleData);
      if (this.chart) this.chart.timeScale().fitContent();
    }
  }
}
