# EquityLabs System Flow & Architecture

This document outlines the end-to-end data flow and architectural components of the EquityLabs trading platform.

## 1. System Overview

EquityLabs is a distributed, event-driven trading engine built for high-throughput order matching and real-time execution streaming. It features an AI layer powered by Google Gemini to provide smart insights to traders.

### Tech Stack
- **Frontend**: Angular 18 (Signals, RxJS, Material)
- **Backend**: Spring Boot 3.2 (WebFlux - Reactive)
- **Messaging**: Apache Kafka (Event-driven decoupling)
- **Databases**: 
  - **PostgreSQL**: Durable storage for orders, trades, and users.
  - **Redis**: Fast, in-memory cache for resting orders in the matching engine.
- **AI**: Google Gemini 1.5 Flash

---

## 2. Core Architectural Components

### A. equitylabs-ui (Angular Frontend)
The user interface where traders interact with the system.
- **Order Form**: Captures BUY/SELL requests. Calls Gemini to explain the order before submission.
- **Trade Feed**: Subscribes to WebSockets for live execution updates.
- **AI Insights**: Displays market summaries and anomaly detections.

### B. order-service (Order Management)
Responsible for order entry, validation, and reliable persistence.
- **REST Controller**: Handles incoming order requests.
- **Market Data Proxy**: Acts as a secure, server-side gateway to fetch market data from Yahoo Finance (`query2`). Bypasses CORS restrictions and handles header spoofing for reliability.
- **Outbox Pattern**: Orders are saved to PostgreSQL and an `outbox` table in a single transaction. A background publisher polls the outbox and sends events to Kafka (`orders-in`). This ensures **at-least-once delivery** even if Kafka is briefly unavailable.
- **Trade Consumer**: Listens to `trades-out` from Kafka to update order statuses in the database.

### C. matching-engine (Match Execution)
The high-performance core that matches buyers and sellers.
- **Order Consumer**: Listens to `orders-in` Kafka topic.
- **Price-Time Priority Logic**: Uses in-memory Priority Queues (Max-Heap for Bids, Min-Heap for Asks).
- **Redis Integration**: Persists the order book state to Redis so it can be restored on restart.
- **Trade Publisher**: Broadcasts matches to `trades-out` Kafka topic.

---

## 3. Detailed Data Flows

### Flow 1: Order Placement & Execution (The "Happy Path")

1.  **Submission**: User clicks "Buy" in Angular UI.
2.  **Order Service API**: `POST /api/orders` receives the request.
3.  **Persistence**: Order is saved to PostgreSQL with status `PENDING`.
4.  **Kafka Publish**: `OutboxPublisher` picks up the event and sends it to `orders-in` topic.
5.  **Matching Engine**: `OrderConsumer` receives the order and passes it to `MatchEngine`.
6.  **Matching**:
    - If a match is found: `MatchEngine` generates a `Trade`.
    - If no match: Order is added to the in-memory book and saved to **Redis**.
7.  **Broadcast**: `Trade` events are published to `trades-out`.
8.  **Real-time Update**:
    - **Frontend**: WebSocket handler in `order-service` consumes `trades-out` and pushes to the Angular UI.
    - **Database**: `TradeConsumer` in `order-service` saves the trade and updates the corresponding order statuses to `FILLED` or `PARTIALLY_FILLED`.

### Flow 2: AI Insights (Gemini Integration)

1.  **Order Explanation**: Before submitting, the UI calls `POST /api/ai/explain-order`. Gemini analyzes the order vs. current market spread and returns a plain-English explanation.
2.  **Anomaly Detection**: When a trade is executed, the AI service (or a dedicated listener) can analyze the trade volume and price deviation vs. historical data to flag potential "fat-finger" trades or market manipulation.
3.  **Market Summary**: Traders can request an AI summary of recent activity for a specific ticker (e.g., "NIFTY50 has strong buy pressure at the 23,500 level").

### Flow 3: Real-time Market Data & Charting

1.  **Request**: UI components (`TickerService`, `StockChartComponent`) request data via `order-service` proxy at `/api/market-proxy/chart/{symbol}`.
2.  **Backend Fetch**: `MarketDataService` uses Spring `WebClient` to query Yahoo Finance `query2.finance.yahoo.com`.
3.  **Precision Extraction**: For live prices, the backend requests `interval=1m`. The frontend extracts the latest valid close from the indicators to ensure price parity with the chart.
4.  **Reactive Updates**:
    - **Tickers**: Poll every 5 seconds with cache-busting.
    - **Charts**: Update on symbol, range, or interval changes (1m, 5m, 15m, 1h, 1d).

---

## 4. Key Design Patterns

- **Reactive Programming**: Uses Project Reactor (Mono/Flux) throughout the backend to handle high concurrency with minimal threads.
- **Event Sourcing (Lite)**: The system state is driven by order and trade events flowing through Kafka.
- **Outbox Pattern**: Guarantees that database updates and message publishing are atomic.
- **Sidecar AI**: Gemini acts as an intelligent observer, providing non-blocking insights without slowing down the core matching logic.
- **Backend-for-Frontend (BFF) Proxy**: Offloads complex/restricted external API interactions (like market data) to the backend to improve UI reliability and security.

---

## 5. Topic/Message Schema

### Kafka Topics
- `orders-in`: Incoming order events from `order-service`.
- `trades-out`: Execution events from `matching-engine`.
- `orders-cancel`: Requests to remove an order from the book.

### Redis Keys
- `orderbook:{orderId}`: JSON representation of a resting order.

---

## 6. Market Data Strategy (Yahoo Finance Integration)

To ensure high availability and accuracy of Indian market data (NSE), the system employs several strategies:

- **Endpoint**: Standardized on `query2.finance.yahoo.com/v8/finance/chart/` for better rate-limit resilience.
- **Symbol Format**: All Indian stocks use the `.NS` suffix (e.g., `RELIANCE.NS`, `TCS.NS`).
- **Interval Logic**:
    - **Live Price**: Fetched using `range=1d&interval=1m` to get the absolute latest trade.
    - **Charts**: Supports multiple resolutions from `1m` to `1d`.
- **Reliability Layer**:
    - **User-Agent Spoofing**: Backend sends modern browser headers to avoid anti-scraping blocks.
    - **Cache Busting**: Frontend appends a unique timestamp to every request to bypass proxy/CDN caching.
    - **Mock Fallback**: If Yahoo is completely unreachable, the system generates consistent mock data based on last-known-good prices.
