package in.equitylabs.engine;

import in.equitylabs.engine.model.Order;
import lombok.Getter;

import java.util.Comparator;
import java.util.PriorityQueue;

@Getter
public class OrderBook {
    private final String symbol;
    private final PriorityQueue<Order> bids; // Buy orders
    private final PriorityQueue<Order> asks; // Sell orders

    public OrderBook(String symbol) {
        this.symbol = symbol;

        // Bids: Highest price first. If prices equal, earliest time first.
        this.bids = new PriorityQueue<>(
                Comparator.comparing(Order::getPrice).reversed()
                        .thenComparing(Order::getCreatedAt)
        );

        // Asks: Lowest price first. If prices equal, earliest time first.
        this.asks = new PriorityQueue<>(
                Comparator.comparing(Order::getPrice)
                        .thenComparing(Order::getCreatedAt)
        );
    }

    public void addOrder(Order order) {
        if (order.getOrderType() == in.equitylabs.engine.model.OrderType.BUY) {
            bids.add(order);
        } else {
            asks.add(order);
        }
    }
}
