import { Component, Input, OnChanges, SimpleChanges, inject, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { OrderService } from '../../../services/order.service';
import { AiService } from '../../../services/ai.service';
import { TickerService } from '../../../services/ticker.service';
import { OrderType, OrderCategory } from '../../../models/trade.models';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    MatSnackBarModule
  ],
  templateUrl: './order-form.component.html',
  styleUrls: ['./order-form.component.scss']
})
export class OrderFormComponent implements OnChanges {
  @Input() symbol: string = 'RELIANCE.NS';
  private tickerService = inject(TickerService);
  
  orderForm: FormGroup;
  aiExplanation: string = '';
  isAiLoading: boolean = false;
  OrderType = OrderType;
  OrderCategory = OrderCategory;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private aiService: AiService,
    private snackBar: MatSnackBar
  ) {
    this.orderForm = this.fb.group({
      userId: ['demo-user', Validators.required],
      symbol: [this.symbol, Validators.required],
      orderType: [OrderType.BUY, Validators.required],
      orderCategory: [OrderCategory.LIMIT, Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      quantity: [10, [Validators.required, Validators.min(1)]]
    });

    // Auto-update price when ticker data changes for the selected symbol
    effect(() => {
      const tickers = this.tickerService.tickerData();
      const currentTicker = tickers.find(t => t.symbol === this.symbol);
      if (currentTicker && this.orderForm.get('orderCategory')?.value === OrderCategory.MARKET) {
        this.orderForm.patchValue({ price: currentTicker.price }, { emitEvent: false });
      }
    });
  }

  analyzeOrder() {
    if (this.orderForm.valid) {
      this.isAiLoading = true;
      this.aiExplanation = '';
      this.aiService.explainOrder(this.orderForm.value).subscribe({
        next: (res) => {
          this.aiExplanation = res.explanation;
          this.isAiLoading = false;
        },
        error: () => {
          this.aiExplanation = 'AI Analysis currently unavailable. Please try again later.';
          this.isAiLoading = false;
        }
      });
    } else {
      this.snackBar.open('Please fill order details before analysis.', 'OK', { duration: 3000 });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['symbol']) {
      this.updatePriceForSymbol();
    }
  }

  private updatePriceForSymbol() {
    const tickers = this.tickerService.tickerData();
    const currentTicker = tickers.find(t => t.symbol === this.symbol);
    
    this.orderForm.patchValue({ 
      symbol: this.symbol,
      price: currentTicker ? currentTicker.price : 0
    });
  }

  get isBuy() { return this.orderForm.get('orderType')?.value === OrderType.BUY; }
  get currentSymbol() { return this.orderForm.get('symbol')?.value; }

  get totalValue() {
    const price = this.orderForm.get('price')?.value || 0;
    const qty = this.orderForm.get('quantity')?.value || 0;
    return price * qty;
  }

  setOrderType(type: OrderType) {
    this.orderForm.patchValue({ orderType: type });
  }

  submitOrder() {
    if (this.orderForm.valid) {
      const orderData = this.orderForm.value;
      this.orderService.createOrder(orderData).subscribe({
        next: (res) => {
          if (res.status === 'ACCEPTED') {
            this.snackBar.open(
              `Successfully placed ${orderData.orderType} order for ${orderData.quantity} units of ${orderData.symbol}`,
              'Dismiss',
              {
                duration: 5000,
                horizontalPosition: 'right',
                verticalPosition: 'top',
                panelClass: [this.isBuy ? 'buy-toast' : 'sell-toast']
              }
            );
          } else {
            this.snackBar.open('Order Failed: ' + res.message, 'Close', { duration: 5000 });
          }
        },
        error: (err) => {
          this.snackBar.open('Error placing order. Please check your connection.', 'Close', {
            duration: 5000,
            horizontalPosition: 'right',
            verticalPosition: 'top',
          });
          console.error('Submission error:', err);
        }
      });
    } else {
      this.snackBar.open('Please fill all order details correctly (Price must be > 0)', 'OK', { duration: 3000 });
    }
  }
}
