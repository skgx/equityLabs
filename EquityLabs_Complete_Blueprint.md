# EquityLabs Trading Engine — Complete Production Blueprint
## equitylabs.in | Java + Spring Boot + Angular + AI | Resume-Grade System

**Version**: 1.0 Final  
**Target**: Fintech job seeker, Associate Dev @ TransUnion (18 months)  
**Goal**: Live, accessible trading engine demo at equitylabs.in — no laptop required  
**AI Feature**: Gemini API — smart assistant layer (not a gimmick, genuinely useful)

---

## TABLE OF CONTENTS

1. [What You're Actually Building (No Bullshit)](#1-what-youre-actually-building)
2. [Full Tech Stack — Every Tool, Every Purpose](#2-full-tech-stack)
3. [System Architecture — How Everything Fits](#3-system-architecture)
4. [What Real Brokers Do (Zerodha, Upstox)](#4-what-real-brokers-do)
5. [The AI Layer — Gemini Integration Plan](#5-the-ai-layer)
6. [UI Plan — Angular Frontend](#6-the-ui-plan)
7. [Deployment — Live at equitylabs.in (From Zero)](#7-deployment-guide)
8. [Day-by-Day 14-Day Plan](#8-day-by-day-plan)
9. [Extra Features to Add](#9-extra-features)
10. [Testing Strategy](#10-testing-strategy)
11. [Interview Talking Points](#11-interview-talking-points)

---

## 1. WHAT YOU'RE ACTUALLY BUILDING

### The Product: EquityLabs Trading Engine

A working demo of an **order matching engine** — the core system inside every stock exchange and trading platform. You submit BUY/SELL orders, the engine matches them in real-time, creates trades, and streams them live.

**What it demonstrates**: You understand how a real trading platform works at the infrastructure level — not just CRUD APIs, but distributed, event-driven, low-latency systems with an AI layer on top.

**Why this is rare**: Most Java devs at your level have built REST CRUD apps. You'll have built something that Zerodha, Upstox, or any trading firm would recognize as their core domain.

### The Three Layers You'll Build

```
┌─────────────────────────────────────────────┐
│  LAYER 3: Intelligence (Gemini AI)          │
│  ─ Explain orders in plain English           │
│  ─ Detect anomalous trading patterns         │
│  ─ Smart market summary (LLM-driven)         │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  LAYER 2: Application (Java Spring Boot)    │
│  ─ REST API for order submission             │
│  ─ Order matching engine (core logic)        │
│  ─ Kafka for async order processing          │
│  ─ WebSocket for real-time trade streaming   │
└──────────────────┬──────────────────────────┘
                   │
┌──────────────────▼──────────────────────────┐
│  LAYER 1: Data (PostgreSQL + Redis)         │
│  ─ PostgreSQL: durable storage (Railway)     │
│  ─ Redis: fast cache (Upstash, free)         │
└─────────────────────────────────────────────┘
```

### What's Live at equitylabs.in

- `equitylabs.in` → Angular UI (hosted on Vercel/Netlify — free)
- `api.equitylabs.in` → Spring Boot backend (hosted on Railway — ~$5/mo)
- `api.equitylabs.in/ws/trades/AAPL` → WebSocket stream (live trades)
- `api.equitylabs.in/api/ai/insight` → Gemini AI analysis
- `api.equitylabs.in/swagger-ui` → API documentation

---

## 2. FULL TECH STACK

Every tool, what it does, why you chose it, cost.

### BACKEND

| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| **Java** | 21 (LTS) | Core language | LTS, virtual threads (Project Loom), modern |
| **Spring Boot** | 3.2.x | Web framework | Industry standard, WebFlux for async |
| **Spring WebFlux** | (included) | Reactive REST + WebSocket | Non-blocking, handles 10k+ concurrent connections |
| **Apache Kafka** | (via Upstash) | Order queue / event bus | Decouples order submission from matching; auditable |
| **Spring Kafka** | (included) | Kafka client for Spring | Easy integration |
| **PostgreSQL** | 15 | Primary database | ACID, reliable, what Zerodha uses, free on Railway |
| **Spring Data R2DBC** | (included) | Reactive DB access | Non-blocking DB calls with WebFlux |
| **Redis** | 7 (via Upstash) | In-memory cache | Sub-1ms active order lookup, free tier available |
| **Resilience4j** | 2.1.x | Circuit breakers + rate limiting | Prevents cascades, controls load |
| **Spring Security** | (included) | JWT auth | Stateless API security |
| **Micrometer** | (included) | Metrics collection | Feeds Prometheus |
| **Lombok** | (latest) | Reduce boilerplate | Cleaner code |
| **MapStruct** | 1.5.x | DTO mapping | Type-safe, compiled |

### AI LAYER

| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| **Google Gemini API** | 1.5 Flash | AI features (see Section 5) | FREE 1M tokens/day, fast, cost-efficient |
| **Spring AI** | 1.0.x | Gemini Java client | Native Spring integration |

> **Why Gemini over OpenAI?** Gemini 1.5 Flash is free up to 1M tokens/day. For a portfolio project running at demo scale, you pay literally nothing. OpenAI would cost money from day 1. Same quality for most trading AI use cases.

### FRONTEND

| Tool | Version | Purpose | Why |
|------|---------|---------|-----|
| **Angular** | 18 | SPA framework | Enterprise-standard, signals, reactive forms |
| **RxJS** | 7.x | Reactive programming | WebSocket subscriptions, async data streams |
| **Angular Material** | 18 | UI components | Professional look without design work |
| **Lightweight Charts** | 4.x (TradingView) | Candlestick / price charts | Real TradingView-style charts, free, MIT |
| **TailwindCSS** | 3.x | Utility CSS | Fast professional styling |
| **Chart.js** | 4.x | Metrics visualizations | Order volume, depth charts |

### INFRA / DEPLOYMENT

| Tool | Purpose | Cost |
|------|---------|------|
| **Railway.app** | Host Spring Boot app (production) | $5/mo (Hobby plan, always-on) |
| **Neon.tech** | PostgreSQL — both local dev AND production | Free forever (0.5 GB) |
| **Upstash Redis** | Managed Redis (serverless) | Free up to 10k requests/day |
| **Upstash Kafka** | Managed Kafka (serverless) | Free up to 10k messages/day |
| **Vercel** | Host Angular UI | Free forever |
| **GitHub** | Source control + CI/CD | Free |
| **GitHub Actions** | Automated deploy pipeline | Free |
| **Cloudflare** | DNS for equitylabs.in | Free |

**Total monthly cost**: ~$5/month (Railway Hobby plan, only needed for production deployment)  
**Local development cost**: $0 — all cloud services are free tier

### LOCAL DEVELOPMENT (Windows, No Docker)

Everything database-related runs in the cloud on free tiers. You only install the build tools locally.

| Tool | Purpose | Install |
|------|---------|---------|
| **Java 21** | Runtime | Installer from https://adoptium.net → Windows x64 `.msi` |
| **Maven 3.9** | Build tool | Bundled in IntelliJ — no separate install needed |
| **IntelliJ IDEA** | IDE | https://www.jetbrains.com/idea/download → Community (free) |
| **Node.js 20 LTS** | Angular runtime | Installer from https://nodejs.org → Windows LTS |
| **Angular CLI 18** | Angular tool | `npm install -g @angular/cli` (after Node.js installed) |
| **Git** | Version control | https://git-scm.com/download/win |

| Service | What It Replaces | Free Tier |
|---------|-----------------|-----------|
| **Neon.tech** | Local PostgreSQL | Free forever, 0.5 GB storage |
| **Upstash Redis** | Local Redis | Free up to 10k req/day |
| **Upstash Kafka** | Local Kafka | Free up to 10k messages/day |
| **Gemini API** | No local model needed | 1.5M tokens/day free |

**Result**: No Docker, no local database installs, no services to start every morning. Open laptop → run app → everything connects to cloud automatically.

---

## 3. SYSTEM ARCHITECTURE

### How An Order Flows (Complete Path)

```
User (Browser / Postman)
  │
  │  POST /api/orders  {symbol: "NIFTY50", qty: 100, price: 23500, type: BUY}
  ▼
[OrderController.java]  ← validates input, checks auth (JWT)
  │
  │  publish to Kafka topic "orders-in"
  ▼
[Upstash Kafka]  ← durable queue; survives restarts; multiple consumers possible
  │
  │  consumed by OrderIngestionService (Kafka @KafkaListener)
  ▼
[OrderIngestionService.java]
  │
  ├── save Order to PostgreSQL (async, via R2DBC)
  ├── cache Order in Redis (for fast lookups)
  │
  │  call MatchEngine.processOrder(order)
  ▼
[MatchEngine.java]  ← in-memory, priority queue based
  │                    BUY heap: highest price first
  │                    SELL heap: lowest price first
  │
  │  if buy.price >= sell.price → MATCH!
  │
  ├── create Trade object
  ├── update Order statuses (FILLED / PARTIALLY_FILLED)
  ├── save Trade to PostgreSQL
  │
  │  publish Trade to Kafka topic "trades-out"
  ▼
[Upstash Kafka: trades-out]
  │
  ├── [TradeWebSocketHandler.java]  → pushes to Angular UI via WebSocket
  ├── [AIAnalysisService.java]      → checks trade for anomalies via Gemini
  └── [MetricsService.java]         → increments Prometheus counters

User's Browser:
  WebSocket ws://api.equitylabs.in/ws/trades/NIFTY50
  → receives trade in real-time as JSON
  → Angular chart updates instantly
```

### Database Schema (PostgreSQL)

```sql
-- Orders table
CREATE TABLE orders (
    order_id        VARCHAR(50)     PRIMARY KEY,
    user_id         VARCHAR(100)    NOT NULL,
    symbol          VARCHAR(20)     NOT NULL,
    quantity        INTEGER         NOT NULL,
    remaining_qty   INTEGER         NOT NULL,
    price           DECIMAL(12, 2),
    order_type      VARCHAR(10)     NOT NULL,  -- BUY / SELL
    order_category  VARCHAR(10)     NOT NULL,  -- LIMIT / MARKET
    status          VARCHAR(20)     NOT NULL,  -- PENDING, PARTIALLY_FILLED, FILLED, CANCELLED
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_orders_symbol_status ON orders(symbol, status);
CREATE INDEX idx_orders_user          ON orders(user_id);
CREATE INDEX idx_orders_created       ON orders(created_at DESC);

-- Trades table
CREATE TABLE trades (
    trade_id        VARCHAR(50)     PRIMARY KEY,
    symbol          VARCHAR(20)     NOT NULL,
    buy_order_id    VARCHAR(50)     NOT NULL REFERENCES orders(order_id),
    sell_order_id   VARCHAR(50)     NOT NULL REFERENCES orders(order_id),
    executed_price  DECIMAL(12, 2)  NOT NULL,
    quantity        INTEGER         NOT NULL,
    traded_at       TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_trades_symbol_time ON trades(symbol, traded_at DESC);

-- AI Insights table (for storing Gemini analysis)
CREATE TABLE ai_insights (
    id              SERIAL          PRIMARY KEY,
    insight_type    VARCHAR(50)     NOT NULL,  -- ANOMALY, SUMMARY, PATTERN
    symbol          VARCHAR(20),
    content         TEXT            NOT NULL,
    metadata        JSONB,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

-- Market snapshots (for charts)
CREATE TABLE market_snapshots (
    id              SERIAL          PRIMARY KEY,
    symbol          VARCHAR(20)     NOT NULL,
    best_bid        DECIMAL(12, 2),
    best_ask        DECIMAL(12, 2),
    last_price      DECIMAL(12, 2),
    volume_24h      BIGINT,
    snapshot_at     TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);
```

### Redis Cache Keys (Convention)

```
order:{orderId}              → full Order JSON, TTL 24h
symbol-orders:{symbol}       → SET of active orderIds for a symbol, TTL 1h
market-snapshot:{symbol}     → latest price/bid/ask, TTL 5s
rate-limit:{userId}          → request counter, TTL 1 min
ai-cache:{hash-of-prompt}    → Gemini response cache, TTL 30min
```

---

## 4. WHAT REAL BROKERS DO

(Researched from Zerodha's tech blog and public engineering posts)

### How Zerodha (India's #1 Broker) Actually Works

**Backend**: Python for automation/data processing, **Go (Golang) for high-throughput services** (Kite's live market data streaming runs on Go due to goroutines handling thousands of WebSocket connections simultaneously)

**Database**: **PostgreSQL on self-hosted EC2** for transactions (not RDS — saves money), **ClickHouse for analytics** (immutable financial data, faster than Postgres for aggregations)

**Cache**: **Redis** for all hot data — session storage, rate limiting, PnL snapshots

**Frontend**: **Vue.js** for Kite web interface. Flutter for mobile.

**Infrastructure**: Self-hosted on AWS (EC2 + ECS) rather than managed services. Saves "tens of millions of dollars" in observability costs alone.

**Key insight**: Zerodha rebuilt PnL processing from a 7-hour nightly job → 20-30 minute run using **AWS Batch + Redis + containerized jobs**. That's exactly the kind of optimization you want to demonstrate.

### What This Means For Your Project

You don't need to use Go. Java with WebFlux achieves similar concurrency. But it means:

1. **Your WebSocket design** (live trade streaming) mirrors exactly what Kite does
2. **Your PostgreSQL choice** is validated — Zerodha uses it for transactions
3. **Your Redis choice** is validated — they use it the same way
4. **Your Kafka choice** makes sense — event-driven, auditable, recoverable

### Key Difference: Your Project Has an AI Layer

Zerodha does NOT have an embedded AI assistant that explains orders or detects anomalies. **You do.** This is your differentiator over what even Zerodha built publicly.

---

## 5. THE AI LAYER

### Gemini API — What It Does In Your System

**Important**: AI should be useful, not decorative. Here's where Gemini genuinely adds value:

#### Feature 1: Order Explanation (Most Useful)
**What**: When you submit an order, Gemini explains in plain English what your order means and what market conditions might affect it.

**Endpoint**: `POST /api/ai/explain-order`  
**Input**: `{ "symbol": "NIFTY50", "quantity": 100, "price": 23500, "type": "BUY", "category": "LIMIT" }`  
**Output**: *"You're placing a limit buy order for 100 units of NIFTY50 at ₹23,500. This order will only execute if the market price drops to or below ₹23,500. The current spread is 23,480-23,510, so your order is below the market — it will sit in the order book until a seller matches your price. In a falling market, this is a sensible entry strategy."*

#### Feature 2: Anomaly Detection in Trade Feed
**What**: After every trade executes, Gemini (or heuristic + Gemini for explanation) checks if it looks unusual.

**Triggers**:
- Trade quantity is >5x the average for this symbol in the last hour
- Price executed is >2% away from the previous trade price
- Same user placing orders then immediately cancelling (layering)

**Output**: `{ "anomalyScore": 0.85, "reason": "This trade executed at ₹23,800, which is 2.3% above the previous trade at ₹23,250. Unusual price jump — possible thin order book or news event." }`

#### Feature 3: Market Summary (AI-Powered Dashboard Widget)
**What**: Gemini summarizes market activity every 5 minutes based on your engine's data.

**Endpoint**: `GET /api/ai/market-summary/{symbol}`  
**Output**: *"NIFTY50 has seen 847 orders in the last hour with 312 trades executing. Buy pressure is dominant (62% of volume). The order book shows a price ceiling around ₹23,650 where large sell walls exist. Recent volatility is moderate."*

#### Feature 4: Smart Order Suggestions
**What**: Based on current order book depth and recent trade prices, Gemini suggests an optimal limit price.

**Endpoint**: `GET /api/ai/suggest-price/{symbol}/{side}`  
**Output**: `{ "suggestedPrice": 23480, "reasoning": "The best ask is 23,500 but there's thin liquidity above 23,490. A limit buy at 23,480 has a 72% probability of filling within the next 5 minutes based on recent fill rates." }`

### Gemini API Implementation (Java)

```java
// pom.xml dependency
<dependency>
    <groupId>com.google.cloud</groupId>
    <artifactId>google-cloud-vertexai</artifactId>
    <version>1.1.0</version>
</dependency>
// OR use direct REST (simpler for this project)

// GeminiService.java
package org.tradeMatch.ai;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.redis.core.ReactiveRedisTemplate;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.time.Duration;
import java.util.Map;

@Service
@Slf4j
@RequiredArgsConstructor
public class GeminiService {

    @Value("${gemini.api-key}")
    private String geminiApiKey;

    private final WebClient webClient = WebClient.create("https://generativelanguage.googleapis.com");
    private final ReactiveRedisTemplate<String, String> redisTemplate;

    private static final String CACHE_PREFIX = "ai-cache:";
    private static final Duration CACHE_TTL = Duration.ofMinutes(30);

    /**
     * Core method: send prompt to Gemini, cache the response
     */
    public Mono<String> ask(String prompt) {
        String cacheKey = CACHE_PREFIX + Integer.toHexString(prompt.hashCode());

        // Check cache first (avoid re-hitting Gemini with same prompt)
        return redisTemplate.opsForValue().get(cacheKey)
            .switchIfEmpty(
                callGemini(prompt)
                    .flatMap(response ->
                        redisTemplate.opsForValue()
                            .set(cacheKey, response, CACHE_TTL)
                            .thenReturn(response)
                    )
            );
    }

    private Mono<String> callGemini(String prompt) {
        Map<String, Object> body = Map.of(
            "contents", new Object[]{
                Map.of("parts", new Object[]{
                    Map.of("text", prompt)
                })
            },
            "generationConfig", Map.of(
                "temperature", 0.3,
                "maxOutputTokens", 300,
                "topP", 0.8
            )
        );

        return webClient.post()
            .uri("/v1beta/models/gemini-1.5-flash:generateContent?key=" + geminiApiKey)
            .contentType(MediaType.APPLICATION_JSON)
            .bodyValue(body)
            .retrieve()
            .bodyToMono(Map.class)
            .map(response -> {
                var candidates = (java.util.List<?>) response.get("candidates");
                var firstCandidate = (Map<?, ?>) candidates.get(0);
                var content = (Map<?, ?>) firstCandidate.get("content");
                var parts = (java.util.List<?>) content.get("parts");
                var firstPart = (Map<?, ?>) parts.get(0);
                return (String) firstPart.get("text");
            })
            .doOnError(e -> log.error("Gemini API error: {}", e.getMessage()));
    }

    /**
     * Explain an order in plain English
     */
    public Mono<String> explainOrder(String symbol, int qty, double price,
                                     String type, String category,
                                     double bestBid, double bestAsk) {
        String prompt = String.format("""
            You are a concise financial analyst AI. Explain this trading order in 2-3 sentences.
            
            Order details:
            - Symbol: %s
            - Quantity: %d
            - Price: %.2f
            - Type: %s
            - Category: %s (LIMIT orders only execute at the specified price or better; MARKET orders execute immediately at best available price)
            - Current Best Bid: %.2f, Best Ask: %.2f
            
            Explain what this order means and what will happen. Use plain English.
            No markdown formatting. Maximum 3 sentences.
            """, symbol, qty, price, type, category, bestBid, bestAsk);

        return ask(prompt);
    }

    /**
     * Detect anomaly in a trade
     */
    public Mono<String> analyzeTradeAnomaly(String symbol, double executedPrice,
                                             double avgPrice, int quantity,
                                             int avgQuantity) {
        double priceDev = Math.abs(executedPrice - avgPrice) / avgPrice * 100;
        double qtyDev = (double) quantity / avgQuantity;

        // Only call Gemini if something actually looks unusual
        if (priceDev < 1.5 && qtyDev < 3) {
            return Mono.just("NORMAL");
        }

        String prompt = String.format("""
            You are a market surveillance AI. A trade just executed with these details:
            
            - Symbol: %s
            - Executed price: %.2f
            - Average price (last hour): %.2f (deviation: %.1f%%)
            - Trade quantity: %d
            - Average quantity (last hour): %d (ratio: %.1fx)
            
            Is this anomalous? Respond with JSON only:
            {"anomalyScore": 0.0-1.0, "type": "PRICE_SPIKE|VOLUME_SURGE|NORMAL", "explanation": "one sentence"}
            """, symbol, executedPrice, avgPrice, priceDev, quantity, avgQuantity, qtyDev);

        return ask(prompt);
    }

    /**
     * Generate market summary for a symbol
     */
    public Mono<String> generateMarketSummary(String symbol, long totalOrders,
                                               long totalTrades, double buyRatio,
                                               double lastPrice, double priceChange) {
        String prompt = String.format("""
            You are a real-time market analyst. Summarize market activity in 2-3 sentences.
            
            Symbol: %s
            - Total orders last hour: %d
            - Trades executed: %d
            - Buy order ratio: %.0f%%
            - Last traded price: %.2f
            - Price change last hour: %.2f%%
            
            Write a concise, factual summary like a Bloomberg terminal brief.
            No markdown. No more than 3 sentences.
            """, symbol, totalOrders, totalTrades, buyRatio * 100, lastPrice, priceChange);

        return ask(prompt);
    }

    /**
     * Suggest optimal limit price
     */
    public Mono<String> suggestPrice(String symbol, String side,
                                     double bestBid, double bestAsk,
                                     double recentFillRate) {
        String prompt = String.format("""
            You are a trading strategy AI. Suggest an optimal limit price.
            
            Symbol: %s, Side: %s
            Best Bid: %.2f, Best Ask: %.2f
            Spread: %.2f
            Recent fill rate (orders filled within 5min): %.0f%%
            
            Suggest a limit price and brief reasoning.
            Respond with JSON only:
            {"price": 0.00, "confidence": "HIGH|MEDIUM|LOW", "reasoning": "one sentence"}
            """, symbol, side, bestBid, bestAsk, bestAsk - bestBid, recentFillRate * 100);

        return ask(prompt);
    }
}
```

### AI Controller

```java
// AIController.java
package org.tradeMatch.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.tradeMatch.ai.GeminiService;
import org.tradeMatch.service.MarketDataService;
import reactor.core.publisher.Mono;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AIController {

    private final GeminiService geminiService;
    private final MarketDataService marketDataService;

    @PostMapping("/explain-order")
    public Mono<ExplainOrderResponse> explainOrder(@RequestBody ExplainOrderRequest req) {
        return marketDataService.getOrderBook(req.getSymbol())
            .flatMap(book -> geminiService.explainOrder(
                req.getSymbol(), req.getQuantity(), req.getPrice(),
                req.getOrderType(), req.getOrderCategory(),
                book.getBestBid(), book.getBestAsk()
            ))
            .map(explanation -> new ExplainOrderResponse(req.getSymbol(), explanation));
    }

    @GetMapping("/market-summary/{symbol}")
    public Mono<MarketSummaryResponse> getMarketSummary(@PathVariable String symbol) {
        return marketDataService.getMarketStats(symbol)
            .flatMap(stats -> geminiService.generateMarketSummary(
                symbol,
                stats.getTotalOrders(),
                stats.getTotalTrades(),
                stats.getBuyRatio(),
                stats.getLastPrice(),
                stats.getPriceChange()
            ))
            .map(summary -> new MarketSummaryResponse(symbol, summary));
    }

    @GetMapping("/suggest-price/{symbol}/{side}")
    public Mono<PriceSuggestionResponse> suggestPrice(
            @PathVariable String symbol,
            @PathVariable String side) {
        return marketDataService.getOrderBook(symbol)
            .flatMap(book -> geminiService.suggestPrice(
                symbol, side,
                book.getBestBid(),
                book.getBestAsk(),
                book.getRecentFillRate()
            ))
            .map(json -> parseJsonToResponse(json, symbol, side));
    }
}
```

### How to Get Gemini API Key (Free)

1. Go to https://aistudio.google.com/
2. Click "Get API Key"
3. Create a new project
4. Copy the API key
5. Add to `application.yml`:
   ```yaml
   gemini:
     api-key: ${GEMINI_API_KEY}
   ```
6. Set `GEMINI_API_KEY` as environment variable on Railway

**Free tier**: 1,500 requests/day, 1M tokens/day — more than enough for a demo.

---

## 6. THE UI PLAN

### What the Angular UI Includes

```
equitylabs.in
├── /                   → Dashboard (home page)
├── /trade              → Order submission + live feed
├── /orderbook          → Live order book depth visualization
├── /ai-insights        → AI-powered market analysis page
└── /metrics            → System performance (orders/sec, latency)
```

### Page 1: Dashboard (/)

```
┌─────────────────────────────────────────────────────────┐
│  EquityLabs  ─────────────────────── [Trade] [AI] [Metrics]│
├─────────────────────────────────────────────────────────┤
│                                                          │
│  Market Overview                                         │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐     │
│  │  NIFTY50    │  │  BANKNIFTY  │  │  AAPL       │     │
│  │  23,450     │  │  48,230     │  │  $189.50    │     │
│  │  ▲ +0.8%    │  │  ▼ -0.3%   │  │  ▲ +1.2%   │     │
│  └─────────────┘  └─────────────┘  └─────────────┘     │
│                                                          │
│  Recent Trades (Live WebSocket)                          │
│  TIME     SYMBOL    QTY    PRICE    TYPE                │
│  14:32:05 NIFTY50   100    23,450   BUY-SELL            │
│  14:32:03 AAPL      500    189.50   BUY-SELL            │
│  ...                                                     │
│                                                          │
│  AI Market Brief (refreshes every 5 min)                 │
│  ┌──────────────────────────────────────────────────┐   │
│  │ 🤖 "NIFTY50 shows strong buy pressure with 847   │   │
│  │ orders in the last hour. Price resistance at      │   │
│  │ 23,650 level. Volume is 2.3x above average."    │   │
│  └──────────────────────────────────────────────────┘   │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Page 2: Trade Page (/trade)

```
┌─────────────────────────────────────────────────────────┐
│                                                          │
│  ┌──────────── ORDER FORM ─────────────────────────┐   │
│  │  Symbol:   [NIFTY50              ▼]              │   │
│  │  Type:     [BUY ●] [SELL ○]                      │   │
│  │  Category: [LIMIT ●] [MARKET ○]                  │   │
│  │  Price:    [23,450.00]                           │   │
│  │  Quantity: [100          ]                        │   │
│  │                                                   │   │
│  │  🤖 AI Suggestion: Optimal price is ₹23,440       │   │
│  │     (72% fill probability in 5 min)               │   │
│  │                                                   │   │
│  │  [Submit Order]  [Clear]                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  AI Explanation (appears after form is filled):          │
│  "You're placing a limit buy for 100 NIFTY50 at          │
│  ₹23,450. The best ask is ₹23,455 so your order will     │
│  sit in the book waiting for a seller at your price."    │
│                                                          │
│  ORDER BOOK DEPTH                                        │
│  SELL ORDERS          │          BUY ORDERS             │
│  50  @ 23,460         │  100  @ 23,450 ← yours           │
│  200 @ 23,465         │  75   @ 23,445                   │
│  100 @ 23,470         │  300  @ 23,440                   │
│                                                          │
│  RECENT TRADES (Live)                                    │
│  [scrolling table of last 50 trades]                     │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Page 3: AI Insights (/ai-insights)

```
┌─────────────────────────────────────────────────────────┐
│  AI Market Intelligence                                  │
│                                                          │
│  ┌── ANOMALY ALERTS ──────────────────────────────┐    │
│  │  ⚠️ 14:31:02 NIFTY50 — Price spike detected    │    │
│  │  Trade at 23,800 (+2.3% from prev). Unusual    │    │
│  │  volume: 5,000 units vs avg 200/trade          │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌── MARKET SUMMARY ──────────────────────────────┐    │
│  │  Symbol: [NIFTY50 ▼]  [Refresh]                │    │
│  │                                                  │    │
│  │  "NIFTY50 has seen 847 orders in the last       │    │
│  │  hour with 312 trades executing. Buy pressure   │    │
│  │  is dominant (62% of volume). Large sell walls  │    │
│  │  exist around ₹23,650."                         │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
│  ┌── TRADE PATTERN HISTORY ───────────────────────┐    │
│  │  [Bar chart: volume over last 24 hours]         │    │
│  │  [Anomaly markers on chart]                     │    │
│  └────────────────────────────────────────────────┘    │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

### Angular Component Structure

```
src/app/
├── components/
│   ├── dashboard/
│   │   ├── dashboard.component.ts
│   │   └── dashboard.component.html
│   ├── trade/
│   │   ├── order-form/
│   │   │   ├── order-form.component.ts       ← form + AI suggestion
│   │   │   └── order-form.component.html
│   │   ├── order-book/
│   │   │   ├── order-book.component.ts       ← live order depth
│   │   │   └── order-book.component.html
│   │   └── trade-feed/
│   │       ├── trade-feed.component.ts       ← WebSocket live trades
│   │       └── trade-feed.component.html
│   ├── ai-insights/
│   │   ├── market-summary/
│   │   │   └── market-summary.component.ts   ← AI text + refresh
│   │   └── anomaly-feed/
│   │       └── anomaly-feed.component.ts     ← anomaly alert list
│   └── metrics/
│       └── system-metrics.component.ts       ← latency, req/sec
├── services/
│   ├── order.service.ts                      ← REST calls to backend
│   ├── trade.service.ts                      ← WebSocket subscription
│   ├── market.service.ts                     ← market data REST
│   └── ai.service.ts                         ← AI endpoint calls
├── models/
│   ├── order.model.ts
│   ├── trade.model.ts
│   └── ai-insight.model.ts
└── app.routing.ts
```

### Key Angular Code Snippets

```typescript
// trade.service.ts - WebSocket subscription
import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { Observable, retry, delay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TradeService {
  private sockets: Map<string, WebSocketSubject<any>> = new Map();

  subscribeToSymbol(symbol: string): Observable<Trade> {
    const wsUrl = `wss://api.equitylabs.in/ws/trades/${symbol}`;

    if (!this.sockets.has(symbol)) {
      this.sockets.set(symbol, webSocket(wsUrl));
    }

    return this.sockets.get(symbol)!.pipe(
      retry({ count: 5, delay: 2000 })  // auto-reconnect
    );
  }

  unsubscribe(symbol: string): void {
    this.sockets.get(symbol)?.complete();
    this.sockets.delete(symbol);
  }
}

// order-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { debounceTime, switchMap, distinctUntilChanged } from 'rxjs/operators';

@Component({ selector: 'app-order-form', ... })
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  aiExplanation: string = '';
  aiSuggestedPrice: number | null = null;
  isLoadingAI = false;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private aiService: AIService
  ) {
    this.orderForm = this.fb.group({
      symbol:        ['NIFTY50', Validators.required],
      orderType:     ['BUY', Validators.required],
      orderCategory: ['LIMIT', Validators.required],
      price:         [null, [Validators.required, Validators.min(0.01)]],
      quantity:      [null, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    // Auto-explain order as user fills form (debounced)
    this.orderForm.valueChanges.pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      switchMap(values => {
        if (this.orderForm.valid) {
          this.isLoadingAI = true;
          return this.aiService.explainOrder(values);
        }
        return [];
      })
    ).subscribe({
      next: (resp) => {
        this.aiExplanation = resp.explanation;
        this.isLoadingAI = false;
      },
      error: () => this.isLoadingAI = false
    });

    // Load AI price suggestion when symbol changes
    this.orderForm.get('symbol')?.valueChanges.pipe(
      debounceTime(500),
      switchMap(symbol => this.aiService.suggestPrice(symbol, this.orderForm.value.orderType))
    ).subscribe(resp => {
      this.aiSuggestedPrice = resp.price;
    });
  }

  submitOrder(): void {
    if (this.orderForm.valid) {
      this.orderService.submitOrder(this.orderForm.value).subscribe({
        next: (resp) => console.log('Order submitted:', resp.orderId),
        error: (err) => console.error('Error:', err)
      });
    }
  }
}
```

---

## 7. DEPLOYMENT GUIDE

### Overview: What Lives Where

```
Domain: equitylabs.in (you own this)

equitylabs.in         → Vercel (Angular UI, free)
api.equitylabs.in     → Railway (Spring Boot backend, ~$5/mo)
  └── PostgreSQL       → Railway managed DB (included in $5)
  └── Redis            → Upstash (free tier, serverless)
  └── Kafka            → Upstash (free tier, serverless)
```

### STEP 0: Install Required Tools (Start from Scratch)

```bash
# macOS (use Homebrew — install it if you don't have it)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Java 21
brew install --cask temurin@21
java -version  # Should show 21.x

# Install Maven
brew install maven
mvn -version  # Should show 3.9.x

# Install Node.js (for Angular)
brew install node
node -v  # Should show 20.x

# Install Angular CLI
npm install -g @angular/cli
ng version  # Should show 18.x

# Install Git
brew install git
git --version

# Windows users: use WSL2 (Ubuntu) or download installers from each tool's website
```

### STEP 1: Install Tools on Windows (One-Time, 30 minutes)

1. **Java 21** → https://adoptium.net/temurin/releases/ → Windows x64 `.msi` → install → restart terminal
2. **IntelliJ IDEA Community** → https://www.jetbrains.com/idea/download → Community edition (free)
3. **Node.js 20 LTS** → https://nodejs.org → Windows installer
4. **Git** → https://git-scm.com/download/win

Open a new **Command Prompt** after installing and verify:
```cmd
java -version     :: should say 21.x
node -v           :: should say 20.x
git --version     :: should say 2.x

:: Install Angular CLI
npm install -g @angular/cli
ng version        :: should say 18.x
```

Maven is bundled inside IntelliJ — no separate install needed. IntelliJ will use its own Maven automatically.

---

### STEP 2: Set Up Neon PostgreSQL (10 minutes, free forever)

1. Go to **https://neon.tech** → Sign up free (GitHub login works)
2. Click **"Create Project"** → Name: `equitylabs` → Create
3. On the dashboard → **"Connection Details"** panel
4. Change the dropdown from **"psql"** to **"Connection string"**
5. Copy the string — it looks like:
   ```
   postgresql://alex:AbcXyz123@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
6. You need **two versions** of this for Spring Boot:

   From: `postgresql://alex:AbcXyz123@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require`

   **R2DBC URL** (reactive driver — replace prefix):
   ```
   r2dbc:postgresql://alex:AbcXyz123@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslMode=REQUIRE
   ```

   **JDBC URL** (Flyway migrations — replace prefix):
   ```
   jdbc:postgresql://alex:AbcXyz123@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

---

### STEP 3: Set Up Upstash Redis + Kafka (10 minutes, free)

#### Redis:
1. Go to **https://console.upstash.com** → Sign up free
2. **Redis** tab → **"Create Database"**
   - Name: `equitylabs-redis`
   - Type: Regional
   - Region: pick closest to you (e.g. `ap-southeast-1` for India)
3. After creation → click the database → **"Details"** tab
4. Copy the **"Redis URL"** — looks like:
   ```
   rediss://default:AbcXyz123@happy-fox-12345.upstash.io:6379
   ```
   Note the double `s` in `rediss://` — that means SSL, which is required.

#### Kafka:
1. Same Upstash console → **"Kafka"** tab → **"Create Cluster"**
   - Name: `equitylabs-kafka`
   - Region: same as Redis
2. After creation → **"Details"** tab → copy:
   - **Bootstrap Endpoint**: `flying-mantis-1234-eu1-kafka.upstash.io:9092`
   - **Username**: (copy exactly)
   - **Password**: (copy exactly)
3. Go to **"Topics"** tab → Create these 4 topics one by one:
   - `orders-in` — partitions: 3
   - `trades-out` — partitions: 3
   - `orders-cancel` — partitions: 1
   - `orders-dlq` — partitions: 1

---

### STEP 4: Get Gemini API Key (5 minutes, free)

1. Go to **https://aistudio.google.com**
2. Sign in with any Google account
3. Click **"Get API Key"** → **"Create API key in new project"**
4. Copy the key — starts with `AIza...`
5. Free limits: 1,500 requests/day, 1M tokens/day — more than enough

---

### STEP 5: Configure Environment Variables Using `.env` File

**You do not need Windows System Variables.** Spring Boot can read a `.env` file directly from your project folder using the `spring-dotenv` library. This is the cleanest approach — your credentials stay in one file, never leave your machine, and IntelliJ picks them up automatically.

#### Add the dotenv dependency to `pom.xml`:
```xml
<dependency>
    <groupId>me.paulschwarz</groupId>
    <artifactId>spring-dotenv</artifactId>
    <version>4.0.0</version>
</dependency>
```

#### Create `.env` in your project root (same folder as `pom.xml`):
```properties
# Neon PostgreSQL
DATABASE_URL=r2dbc:postgresql://alex:AbcXyz123@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslMode=REQUIRE
FLYWAY_URL=jdbc:postgresql://alex:AbcXyz123@ep-cool-123.us-east-2.aws.neon.tech/neondb?sslmode=require
DATABASE_USER=alex
DATABASE_PASSWORD=AbcXyz123

# Upstash Redis
REDIS_URL=rediss://default:AbcXyz123@happy-fox-12345.upstash.io:6379

# Upstash Kafka
KAFKA_BOOTSTRAP_SERVERS=flying-mantis-1234.upstash.io:9092
KAFKA_USERNAME=flying-mantis-1234
KAFKA_PASSWORD=AbcXyz123

# Gemini AI
GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXX
```

#### Add `.env` to `.gitignore` (IMPORTANT — never commit credentials):
```
# .gitignore
.env
target/
*.class
```

#### Create `.env.example` (commit this — shows others what vars are needed):
```properties
# Copy this to .env and fill in your values
DATABASE_URL=
FLYWAY_URL=
DATABASE_USER=
DATABASE_PASSWORD=
REDIS_URL=
KAFKA_BOOTSTRAP_SERVERS=
KAFKA_USERNAME=
KAFKA_PASSWORD=
GEMINI_API_KEY=
```

That's it. When you run `mvn spring-boot:run` or click Run in IntelliJ, Spring Boot automatically reads the `.env` file and injects all values wherever `${VARIABLE_NAME}` appears in `application.yml`. No Windows System Variables, no IntelliJ configuration needed.

---

### STEP 6: application.yml (Final — Windows + All Cloud Services)

```yaml
spring:
  application:
    name: equitylabs-engine

  # Neon PostgreSQL — reactive driver
  r2dbc:
    url: ${DATABASE_URL}
    properties:
      sslMode: REQUIRE

  # Flyway — runs schema migrations on startup
  flyway:
    url: ${FLYWAY_URL}
    user: ${DATABASE_USER}
    password: ${DATABASE_PASSWORD}
    locations: classpath:db/migration
    baseline-on-migrate: true

  # Upstash Kafka
  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS}
    properties:
      security.protocol: SASL_SSL
      sasl.mechanism: SCRAM-SHA-256
      sasl.jaas.config: >
        org.apache.kafka.common.security.scram.ScramLoginModule required
        username="${KAFKA_USERNAME}"
        password="${KAFKA_PASSWORD}";
    producer:
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
      acks: all
      retries: 3
    consumer:
      group-id: equitylabs-engine
      auto-offset-reset: earliest
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "in.equitylabs.*"

  # Upstash Redis
  data:
    redis:
      url: ${REDIS_URL}
      ssl:
        enabled: true

server:
  port: 8080

# Gemini AI
gemini:
  api-key: ${GEMINI_API_KEY}

# Actuator endpoints
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus,info
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

# Logging
logging:
  level:
    in.equitylabs: DEBUG
    org.springframework.kafka: INFO
    io.r2dbc: INFO
```

---

### STEP 7: Verify Everything Connects

Run the app:
```cmd
cd C:\projects\equitylabs-backend
mvn spring-boot:run
```

Then open your browser:
```
http://localhost:8080/actuator/health
```

You should see:
```json
{
  "status": "UP",
  "components": {
    "db": { "status": "UP" },
    "redis": { "status": "UP" },
    "kafka": { "status": "UP" }
  }
}
```

If all three show `UP` — PostgreSQL (Neon), Redis (Upstash), and Kafka (Upstash) are all connected and working. You're ready to build.

---

### Daily Start (Windows)

```cmd
:: Open Command Prompt or IntelliJ terminal
cd C:\projects\equitylabs-backend
mvn spring-boot:run

:: In a second terminal for frontend (once Angular is set up)
cd C:\projects\equitylabs-ui
ng serve
```

No services to start. No Docker. No database to spin up. Just run the app and everything connects automatically via the `.env` file.

```bash
# Create project (IntelliJ or Spring Initializr)
mkdir equitylabs-backend && cd equitylabs-backend

# Go to https://start.spring.io and configure:
# - Project: Maven
# - Language: Java
# - Spring Boot: 3.2.5
# - Java: 21
# - Dependencies: Spring Reactive Web, Spring Data R2DBC, PostgreSQL Driver,
#                 Spring Security, Spring Kafka, Spring Boot Actuator, Lombok
# Download and extract, open in IntelliJ
```

**Full pom.xml dependencies** (copy this exactly):

```xml
<dependencies>
    <!-- Core -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>

    <!-- Database (reactive) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-r2dbc</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>r2dbc-postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>org.flywaydb</groupId>
        <artifactId>flyway-core</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
        <scope>runtime</scope>
    </dependency>

    <!-- Kafka -->
    <dependency>
        <groupId>org.springframework.kafka</groupId>
        <artifactId>spring-kafka</artifactId>
    </dependency>

    <!-- Redis (for Upstash REST client + Lettuce) -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-redis-reactive</artifactId>
    </dependency>
    <dependency>
        <groupId>io.lettuce</groupId>
        <artifactId>lettuce-core</artifactId>
    </dependency>

    <!-- Security -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.12.3</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.12.3</version>
        <scope>runtime</scope>
    </dependency>

    <!-- Resilience -->
    <dependency>
        <groupId>io.github.resilience4j</groupId>
        <artifactId>resilience4j-spring-boot3</artifactId>
        <version>2.1.0</version>
    </dependency>

    <!-- Monitoring -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-actuator</artifactId>
    </dependency>
    <dependency>
        <groupId>io.micrometer</groupId>
        <artifactId>micrometer-registry-prometheus</artifactId>
    </dependency>

    <!-- OpenAPI/Swagger -->
    <dependency>
        <groupId>org.springdoc</groupId>
        <artifactId>springdoc-openapi-starter-webflux-ui</artifactId>
        <version>2.3.0</version>
    </dependency>

    <!-- Utilities -->
    <dependency>
        <groupId>org.projectlombok</groupId>
        <artifactId>lombok</artifactId>
        <optional>true</optional>
    </dependency>
    <dependency>
        <groupId>com.fasterxml.jackson.core</groupId>
        <artifactId>jackson-databind</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>

    <!-- Testing -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>io.projectreactor</groupId>
        <artifactId>reactor-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.springframework.kafka</groupId>
        <artifactId>spring-kafka-test</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>junit-jupiter</artifactId>
        <scope>test</scope>
    </dependency>
    <dependency>
        <groupId>org.testcontainers</groupId>
        <artifactId>postgresql</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
```

**application.yml** (local development using Upstash):

```yaml
spring:
  application:
    name: equitylabs-engine

  # Database (will be replaced by Railway env vars in prod)
  r2dbc:
    url: ${DATABASE_URL:r2dbc:postgresql://localhost:5432/equitylabs}
    username: ${DATABASE_USER:admin}
    password: ${DATABASE_PASSWORD:admin}
    pool:
      max-size: 20
      initial-size: 5

  # Flyway (runs schema migrations)
  flyway:
    url: ${FLYWAY_URL:jdbc:postgresql://localhost:5432/equitylabs}
    user: ${DATABASE_USER:admin}
    password: ${DATABASE_PASSWORD:admin}
    locations: classpath:db/migration

  # Kafka (Upstash)
  kafka:
    bootstrap-servers: ${KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
    properties:
      security.protocol: SASL_SSL
      sasl.mechanism: SCRAM-SHA-256
      sasl.jaas.config: "org.apache.kafka.common.security.scram.ScramLoginModule required username='${KAFKA_USERNAME:}' password='${KAFKA_PASSWORD:}';"
    producer:
      acks: all
      retries: 3
      key-serializer: org.apache.kafka.common.serialization.StringSerializer
      value-serializer: org.springframework.kafka.support.serializer.JsonSerializer
    consumer:
      group-id: equitylabs-engine
      key-deserializer: org.apache.kafka.common.serialization.StringDeserializer
      value-deserializer: org.springframework.kafka.support.serializer.JsonDeserializer
      properties:
        spring.json.trusted.packages: "org.tradeMatch.*"

  # Redis (Upstash)
  data:
    redis:
      url: ${REDIS_URL:redis://localhost:6379}
      ssl:
        enabled: ${REDIS_SSL:false}

server:
  port: ${PORT:8080}

# Actuator / Prometheus
management:
  endpoints:
    web:
      exposure:
        include: health,metrics,prometheus,info
  endpoint:
    health:
      show-details: always
  metrics:
    export:
      prometheus:
        enabled: true

# Gemini AI
gemini:
  api-key: ${GEMINI_API_KEY:}

# App config
equitylabs:
  security:
    jwt-secret: ${JWT_SECRET:changeme-use-strong-secret-in-prod}
  cors:
    allowed-origins: "https://equitylabs.in,http://localhost:4200"
```

### STEP 3: Project File Structure

Create this structure in IntelliJ:

```
equitylabs-backend/
├── src/main/java/in/equitylabs/
│   ├── EquityLabsApplication.java
│   ├── config/
│   │   ├── KafkaConfig.java
│   │   ├── RedisConfig.java
│   │   ├── SecurityConfig.java
│   │   ├── WebSocketConfig.java
│   │   └── ResilienceConfig.java
│   ├── controller/
│   │   ├── OrderController.java
│   │   ├── MarketController.java
│   │   ├── AIController.java
│   │   └── MetricsController.java
│   ├── service/
│   │   ├── OrderIngestionService.java
│   │   ├── MarketDataService.java
│   │   ├── PersistenceService.java
│   │   └── MetricsService.java
│   ├── engine/
│   │   ├── MatchEngine.java
│   │   └── OrderBook.java
│   ├── model/
│   │   ├── Order.java
│   │   ├── Trade.java
│   │   ├── OrderType.java       (enum: BUY, SELL)
│   │   ├── OrderCategory.java   (enum: LIMIT, MARKET)
│   │   └── OrderStatus.java     (enum: PENDING, PARTIALLY_FILLED, FILLED, CANCELLED)
│   ├── dto/
│   │   ├── OrderRequest.java
│   │   ├── OrderResponse.java
│   │   └── MarketSummary.java
│   ├── repository/
│   │   ├── OrderRepository.java
│   │   ├── TradeRepository.java
│   │   └── AiInsightRepository.java
│   ├── cache/
│   │   └── OrderCacheService.java
│   ├── ai/
│   │   └── GeminiService.java
│   └── websocket/
│       └── TradeWebSocketHandler.java
│
├── src/main/resources/
│   ├── application.yml
│   └── db/migration/
│       └── V1__init.sql
│
└── src/test/java/in/equitylabs/
    ├── engine/
    │   └── MatchEngineTest.java
    └── integration/
        └── OrderIntegrationTest.java
```

### STEP 4: Deploy to Railway

```bash
# 1. Push your code to GitHub first
git init
git add .
git commit -m "Initial commit: EquityLabs trading engine"
git remote add origin https://github.com/yourusername/equitylabs-backend.git
git push -u origin main

# 2. Go to https://railway.app
# 3. Sign up (free, use GitHub)
# 4. "New Project" → "Deploy from GitHub repo" → select your repo
# 5. Railway auto-detects Java/Maven and builds

# 6. Add PostgreSQL:
#    In Railway dashboard → "+ New" → "Database" → "PostgreSQL"
#    This creates a managed PostgreSQL database linked to your project

# 7. Set environment variables in Railway:
#    Go to your service → "Variables" tab → Add:
GEMINI_API_KEY=your-key-here
KAFKA_BOOTSTRAP_SERVERS=your-upstash-kafka-bootstrap
KAFKA_USERNAME=your-upstash-kafka-username
KAFKA_PASSWORD=your-upstash-kafka-password
REDIS_URL=rediss://your-upstash-redis-url
JWT_SECRET=your-super-secret-jwt-key-min-32-chars

# 8. Railway auto-sets DATABASE_URL from the PostgreSQL service

# 9. Your app is now live at something like:
#    https://equitylabs-backend-production.up.railway.app
```

### STEP 5: Set Up Custom Domain (api.equitylabs.in)

```
1. In Railway: Service → Settings → "Custom Domain" → Add "api.equitylabs.in"
2. Railway gives you a CNAME target (e.g. "xyz.railway.app")
3. In Cloudflare (your DNS provider for equitylabs.in):
   - Add CNAME record: api → xyz.railway.app
   - Proxy status: DNS only (grey cloud)
4. Wait 5-10 minutes
5. Test: curl https://api.equitylabs.in/actuator/health
```

### STEP 6: Deploy Angular to Vercel

```bash
# In the frontend folder:
ng new equitylabs-ui --routing --style=scss
cd equitylabs-ui

# Update environment.ts with your API URL:
# src/environments/environment.production.ts
export const environment = {
  production: true,
  apiUrl: 'https://api.equitylabs.in',
  wsUrl: 'wss://api.equitylabs.in'
};

# Build
ng build --configuration production

# Deploy to Vercel
npm install -g vercel
vercel  # follow prompts, connect GitHub repo

# Set custom domain in Vercel:
# Project Settings → Domains → Add "equitylabs.in"
# In Cloudflare: A record → 76.76.21.21 (Vercel's IP)
```

### STEP 7: Set Up GitHub Actions (Auto-Deploy)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Railway

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'
      - name: Run tests
        run: mvn clean test
      - name: Build
        run: mvn clean package -DskipTests

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: ${{ secrets.RAILWAY_TOKEN }}
          service: equitylabs-backend
```

Now every `git push` to main triggers tests → build → deploy automatically.

### DNS Summary for equitylabs.in

In Cloudflare DNS:

| Type | Name | Content | Note |
|------|------|---------|------|
| A | @ | 76.76.21.21 | Vercel (Angular UI) |
| CNAME | www | cname.vercel-dns.com | Vercel www redirect |
| CNAME | api | xyz.railway.app | Railway (backend) |

---

## 8. DAY-BY-DAY PLAN

**Prerequisites before Day 1**:
- [ ] Java 21 installed (`java -version` → 21.x)
- [ ] Maven installed (`mvn -version` → 3.9.x)
- [ ] Node.js 20 installed (`node -v` → 20.x)
- [ ] Angular CLI installed (`ng version` → 18.x)
- [ ] Git installed
- [ ] IntelliJ IDEA installed (Community edition is free)
- [ ] Upstash account created (free): https://console.upstash.com
- [ ] Gemini API key obtained (free): https://aistudio.google.com
- [ ] Railway account created (free): https://railway.app
- [ ] GitHub account with new repo created

---

### DAY 1: Project Setup + Fix Existing Code (4 hours)

**Goal**: Spring Boot compiles, all packages correct, basic endpoints run.

**Tasks**:

1. Create new Spring Boot project via Spring Initializr or update your existing one
2. Apply the `pom.xml` from Section 7 Step 2 above
3. Set up project package as `in.equitylabs` (or keep `org.tradeMatch` — your choice)
4. Fix your existing classes:
   - Correct package declaration in every file
   - Fix `OrderBook.java` package (`org.tradeMatch.engine`, not `com.exchange.engine`)
   - Fix `TradeMatchApplication.java` class name reference
5. Create `application.yml` from Section 7 Step 2
6. Create the `src/main/resources/db/migration/V1__init.sql` from Section 3
7. Run: `mvn clean compile` — MUST show `BUILD SUCCESS`
8. Run: `mvn spring-boot:run` — MUST start without errors
9. Test: `curl http://localhost:8080/actuator/health` → should return `{"status":"UP"}`
10. Set up Upstash Redis + Kafka, copy connection strings to `application.yml`
11. Create GitHub repo, push code

**Commit**: `"Day 1: Project setup, compilation fixed, Upstash connected"`

---

### DAY 2: Core Engine + Kafka (5 hours)

**Goal**: Orders flow from REST → Kafka → MatchEngine.

**Tasks**:

1. Verify `MatchEngine.java` and `OrderBook.java` are correct (they already exist)
2. Add the `Order.java`, `Trade.java` model classes if not complete
3. Create `KafkaConfig.java`:
   - Topics: `orders-in` (12 partitions), `trades-out` (12 partitions), `orders-cancel`, `orders-dlq`
   - Producer factory with JSON serializer + `acks=all`
   - Consumer factory
4. Create `OrderIngestionService.java`:
   - `@KafkaListener` on `orders-in` → calls `MatchEngine.processOrder()`
   - Publishes trades to `trades-out`
5. Create basic `OrderController.java`:
   - `POST /api/orders` → validates → publishes to Kafka → returns 202 Accepted
   - `DELETE /api/orders/{id}` → publish cancel event
   - `GET /api/orders/{id}` → stub (returns 404 for now)
6. Create `OrderRequest.java` DTO with `@NotBlank`, `@NotNull` validations
7. Test end-to-end:
   ```bash
   # In one terminal
   mvn spring-boot:run
   
   # In another terminal
   curl -X POST http://localhost:8080/api/orders \
     -H "Content-Type: application/json" \
     -d '{"symbol":"NIFTY50","quantity":100,"price":23500,"orderType":"BUY","orderCategory":"LIMIT"}'
   
   # Expected: 202 Accepted with {"orderId":"...","status":"ACCEPTED"}
   ```
8. Check Upstash Kafka console — should see message in `orders-in` topic

**Commit**: `"Day 2: Kafka order ingestion, MatchEngine integration"`

---

### DAY 3: Persistence (PostgreSQL + Redis) (5 hours)

**Goal**: Every order and trade is stored and cached.

**Tasks**:

1. Verify `V1__init.sql` runs: use Railway PostgreSQL locally via tunnel, or add local PostgreSQL via Homebrew:
   ```bash
   brew install postgresql@15
   brew services start postgresql@15
   createdb equitylabs
   ```
2. Create JPA-equivalent entities for R2DBC:
   - `OrderEntity.java` with `@Table("orders")` — maps to your SQL schema
   - `TradeEntity.java` with `@Table("trades")`
3. Create reactive repositories:
   - `OrderRepository extends R2dbcRepository<OrderEntity, String>`
   - `TradeRepository extends R2dbcRepository<TradeEntity, String>`
   - Add `@Query` methods: `findBySymbolAndStatus`, `findByUserId`
4. Create `OrderCacheService.java`:
   - `cacheOrder(order)` → Redis set with TTL 24h
   - `getOrder(orderId)` → Redis get
   - `addToSymbolSet(symbol, orderId)` → Redis set add
5. Create `PersistenceService.java`:
   - `saveOrder(order)` → write to Redis + PostgreSQL (async, non-blocking)
   - `saveTrade(trade)` → write to PostgreSQL
6. Update `OrderIngestionService` to call `persistenceService.saveOrder()` and `persistenceService.saveTrade()`
7. Test:
   ```bash
   # Submit order
   curl -X POST http://localhost:8080/api/orders -d '...'
   
   # Check PostgreSQL
   psql equitylabs -c "SELECT * FROM orders;"
   ```

**Commit**: `"Day 3: PostgreSQL + Redis persistence, R2DBC reactive repos"`

---

### DAY 4: WebSocket + REST API Completion (5 hours)

**Goal**: Real-time trade streaming + complete REST endpoints.

**Tasks**:

1. Create `TradeWebSocketHandler.java`:
   - Implements `WebSocketHandler`
   - Uses `Sinks.many().replay().limit(50)` per symbol
   - `@KafkaListener("trades-out")` → emits to relevant symbol sink
   - Handle path `/ws/trades/{symbol}`
2. Create `WebSocketConfig.java`:
   - Register `/ws/trades/**` → `TradeWebSocketHandler`
3. Complete `OrderController.java`:
   - `GET /api/orders/{id}` → query PostgreSQL via R2DBC
   - `GET /api/orders?symbol=NIFTY50&userId=u1` → filtered list
4. Create `MarketController.java`:
   - `GET /api/market/{symbol}/orderbook` → current buy/sell depths
   - `GET /api/market/{symbol}/trades?limit=50` → recent trades
   - `GET /api/market/{symbol}/snapshot` → last price, bid, ask, volume
5. Add CORS config for `https://equitylabs.in`:
   ```java
   @Bean
   public CorsConfigurationSource corsConfigurationSource() {
       CorsConfiguration config = new CorsConfiguration();
       config.setAllowedOrigins(List.of("https://equitylabs.in", "http://localhost:4200"));
       config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
       config.setAllowedHeaders(List.of("*"));
       // ...
   }
   ```
6. Test WebSocket:
   ```bash
   # Install wscat
   npm install -g wscat
   wscat -c ws://localhost:8080/ws/trades/NIFTY50
   # Submit an order in another terminal — should see trade appear here
   ```

**Commit**: `"Day 4: WebSocket real-time streaming, complete REST API, CORS"`

---

### DAY 5: AI Layer — Gemini Integration (5 hours)

**Goal**: All 4 AI features working.

**Tasks**:

1. Get Gemini API key from https://aistudio.google.com (free)
2. Create `GeminiService.java` (full code in Section 5 above)
   - `explainOrder()` — explain in plain English
   - `analyzeTradeAnomaly()` — detect price/volume anomalies
   - `generateMarketSummary()` — market brief
   - `suggestPrice()` — optimal limit price
   - Redis cache for all Gemini responses (prevent re-calling same prompt)
3. Create `AIController.java` (code in Section 5 above)
   - `POST /api/ai/explain-order`
   - `GET /api/ai/market-summary/{symbol}`
   - `GET /api/ai/suggest-price/{symbol}/{side}`
4. Wire anomaly detection into `OrderIngestionService`: after every trade, call `geminiService.analyzeTradeAnomaly()` asynchronously, save result to `ai_insights` table
5. Add `GEMINI_API_KEY` to `application.yml` (from env var)
6. Test:
   ```bash
   curl -X POST http://localhost:8080/api/ai/explain-order \
     -H "Content-Type: application/json" \
     -d '{"symbol":"NIFTY50","quantity":100,"price":23500,"orderType":"BUY","orderCategory":"LIMIT"}'
   # Expected: JSON with "explanation" field in plain English
   ```

**Commit**: `"Day 5: Gemini AI — order explanation, anomaly detection, market summary"`

---

### DAY 6: Security + Monitoring (4 hours)

**Goal**: JWT auth protecting APIs + Prometheus metrics.

**Tasks**:

1. Create `SecurityConfig.java`:
   - Protect all `/api/**` with JWT
   - Allow `/actuator/health`, `/actuator/prometheus`, `/ws/**`
   - `GET /api/market/**` — public (no auth needed for viewing)
   - `POST /api/orders`, `DELETE /api/orders/**` — require auth
2. Create a simple `AuthController.java` with `POST /api/auth/token`:
   - Takes `{ "userId": "demo-user", "secret": "demo" }` → returns JWT
   - (For demo purposes — in real prod, use OAuth2)
3. Create `MetricsService.java`:
   - Custom Micrometer counters: `orders.received`, `trades.executed`, `ai.calls`
   - Custom timer: `match.latency`
4. Update `application.yml` to expose Prometheus endpoint
5. Verify Prometheus metrics:
   ```bash
   curl http://localhost:8080/actuator/prometheus | grep equitylabs
   ```
6. Add `@CircuitBreaker` on database calls in `PersistenceService`
7. Add `@RateLimiter` on `OrderController` (20k req/sec limit)

**Commit**: `"Day 6: JWT security, Prometheus metrics, circuit breakers"`

---

### DAY 7: Angular UI — Foundation (5 hours)

**Goal**: Angular project, routing, services, basic order form.

**Tasks**:

```bash
ng new equitylabs-ui --routing --style=scss
cd equitylabs-ui
npm install @angular/material @angular/cdk
npm install lightweight-charts
npm install rxjs  # already included
ng add @angular/material  # choose theme: "Indigo/Pink"
```

1. Set up routing: `/`, `/trade`, `/ai-insights`, `/metrics`
2. Create `environment.ts` files (dev vs prod API URLs)
3. Create services: `order.service.ts`, `trade.service.ts`, `market.service.ts`, `ai.service.ts`
4. Create `OrderFormComponent`:
   - All form fields with Angular Material
   - Submit calls `orderService.submitOrder()`
   - AI explanation appears below form (calls `aiService.explainOrder()` on form change)
5. Create a basic `AppComponent` navbar
6. Test: `ng serve` → `http://localhost:4200` → form visible, can submit

**Commit (frontend)**: `"Day 7: Angular 18 setup, routing, services, order form"`

---

### DAY 8: Angular UI — Trade Feed + Order Book (5 hours)

**Goal**: Live trade streaming, order book depth visualization.

**Tasks**:

1. Create `TradeFeedComponent`:
   - WebSocket subscription via `trade.service.ts`
   - Auto-reconnect on disconnect
   - Table of last 100 trades, newest at top
   - Color coding: green for buy side, red for sell side
2. Create `OrderBookComponent`:
   - Calls `GET /api/market/{symbol}/orderbook`
   - Refreshes every 2 seconds
   - Visual depth bars (CSS width = proportional to order size)
3. Create `DashboardComponent`:
   - Market overview cards (symbol, price, change %)
   - Live trade table (last 10 trades)
   - AI Market Brief widget (calls `aiService.getMarketSummary()`)
4. Create `TradingViewChartComponent`:
   - Uses `lightweight-charts` library (from TradingView, MIT licensed)
   - Shows candlestick chart (data comes from `market.service.ts`)
5. Test everything together: submit order → see it match → see trade in feed → see order book update

**Commit**: `"Day 8: Live trade feed, order book, TradingView-style chart"`

---

### DAY 9: Angular UI — AI Insights Page (4 hours)

**Goal**: Full AI features visible in UI.

**Tasks**:

1. Create `AiInsightsComponent`:
   - Anomaly alerts list (from `GET /api/ai/anomalies/{symbol}`)
   - Market summary widget with refresh button
   - Each anomaly has severity badge (LOW/MEDIUM/HIGH)
2. Integrate AI price suggestion into order form:
   - Chips showing "🤖 AI suggests: ₹23,440" when symbol is selected
   - Clicking it fills the price field
3. Create `SystemMetricsComponent`:
   - Cards: Orders/sec, Trades/sec, Avg latency, Active symbols
   - Data from `GET /actuator/metrics/...`
4. Polish all pages:
   - Consistent color theme (dark trading-style: dark background, green/red for prices)
   - Loading spinners on all async operations
   - Error handling (toast notifications for API errors)
5. Test all pages, fix any broken calls

**Commit**: `"Day 9: AI insights page, price suggestions in UI, metrics dashboard"`

---

### DAY 10: Deploy Everything Live (5 hours)

**Goal**: equitylabs.in is live. api.equitylabs.in is live. End-to-end working.

**Tasks**:

1. **Deploy Backend to Railway**:
   ```bash
   git push origin main  # triggers GitHub Actions if set up, else:
   # In Railway dashboard → Deploy from GitHub
   ```
   - Add all environment variables (GEMINI_API_KEY, KAFKA credentials, etc.)
   - Add PostgreSQL service in Railway
   - Watch deployment logs
   - Test: `curl https://your-app.railway.app/actuator/health`

2. **Set up custom domain**: api.equitylabs.in → Railway
   - Cloudflare CNAME record

3. **Deploy Angular to Vercel**:
   ```bash
   cd equitylabs-ui
   vercel --prod  # deploy production build
   ```
   - Connect equitylabs.in domain
   - Cloudflare A record → Vercel

4. **End-to-end test from public URL**:
   - Open https://equitylabs.in in browser
   - Submit an order via the UI
   - See trade stream update in real-time
   - Get AI explanation
   - Check https://api.equitylabs.in/swagger-ui.html

5. **Fix any production issues** (CORS, env vars, HTTPS WebSocket)

**Commit**: `"Day 10: Production deployment — equitylabs.in live"`

---

### DAY 11: Testing Suite (4 hours)

**Goal**: Unit tests, integration tests, load test.

**Tasks**:

1. Create `MatchEngineTest.java`:
   - Exact match test
   - Partial fill test
   - Market order test
   - Cancel order test
   - Price-time priority test
   - ≥20 test cases

2. Create integration test with embedded Kafka (no Docker needed for tests):
   ```java
   @SpringBootTest
   @EmbeddedKafka(partitions = 1, topics = {"orders-in", "trades-out"})
   class OrderIntegrationTest {
       // Test end-to-end flow using embedded Kafka
   }
   ```

3. Create `GeminiServiceTest.java`:
   - Mock the WebClient calls
   - Test prompt construction
   - Test caching behavior

4. Run and verify: `mvn clean test`

5. For load testing — use a free online tool:
   - https://loader.io — send 1000 concurrent requests to your Railway endpoint
   - Or use `ab` (Apache Bench, built into macOS):
     ```bash
     ab -n 10000 -c 100 https://api.equitylabs.in/actuator/health
     ```

**Commit**: `"Day 11: Unit tests, integration tests, load testing"`

---

### DAY 12: Documentation + Code Polish (4 hours)

**Goal**: Clean GitHub repo that impresses anyone who looks at it.

**Tasks**:

1. Create `README.md`:
   ```markdown
   # EquityLabs Trading Engine
   
   Live demo: https://equitylabs.in | API: https://api.equitylabs.in
   
   Production-grade order matching engine with AI insights.
   Handles high-throughput order flow with real-time trade streaming.
   
   ## Architecture
   [ASCII diagram or PNG]
   
   ## Tech Stack
   Java 21 + Spring Boot 3.2 WebFlux | Apache Kafka | PostgreSQL | Redis
   Angular 18 | Google Gemini AI | Deployed on Railway + Vercel
   
   ## Features
   - Order matching engine (priority queue, O(log n))
   - Real-time trade streaming via WebSocket
   - AI-powered order explanations (Gemini 1.5 Flash)
   - Anomaly detection in trade patterns
   - Live order book depth visualization
   
   ## Swagger API Docs
   https://api.equitylabs.in/swagger-ui.html
   
   ## Quick Start (Local)
   ...
   ```

2. Add OpenAPI annotations to all controllers
3. Create `ARCHITECTURE.md` with system diagram
4. Add Lombok `@Builder`, `@Data`, `@Slf4j` annotations everywhere
5. Clean up any TODO comments, dead code
6. Ensure all environment variables are documented in `.env.example`

**Commit**: `"Day 12: Documentation, README, Swagger, code polish"`

---

### DAY 13: Extra Features (Choose 1-2) (4 hours)

**Goal**: Add one feature that makes this stand out further.

See Section 9 for the full list. Recommended for today:

**Option A: Order History Page** (3 hours)
- Angular page showing a user's order history
- Filter by symbol, status, date
- Shows partial fill progress

**Option B: Notifications (Gemini-powered)** (4 hours)
- When an order gets filled, Gemini sends a notification:
  *"Your BUY order for 100 NIFTY50 at ₹23,450 has been filled. You traded with 2 counterparties."*
- Store in database, show in Angular notification bell icon

**Option C: Market Replay** (4 hours)
- Record all trades to a table with timestamps
- Play them back in the UI to replay a trading session
- Great for demos!

**Commit**: `"Day 13: [Feature added]"`

---

### DAY 14: Interview Prep + Final Polish (3 hours)

**Goal**: Ready to show this in any interview.

**Tasks**:

1. Record a 3-minute screen recording of the live demo:
   - Show equitylabs.in
   - Submit an order
   - Show the real-time trade stream
   - Show the AI explanation
   - Show the API docs
   - Upload to YouTube (unlisted)
   - Add YouTube link to README

2. Update LinkedIn:
   - Add "Trading Systems" to skills
   - Add this project to the "Projects" section
   - Brief description + link to equitylabs.in

3. Practice the interview answer (see Section 11)

4. Test everything one more time from scratch (incognito browser, fresh device)

**Commit**: `"Day 14: Final polish, demo ready, README updated with demo video"`

---

## 9. EXTRA FEATURES

These are real, impactful additions. Build them after the core is done.

### Feature A: Position Tracking (High Value)
Track each user's net position across their orders. Shows you understand risk.
- Table: `positions (user_id, symbol, net_quantity, avg_price, unrealized_pnl)`
- Endpoint: `GET /api/positions/{userId}`
- Angular component: Portfolio P&L page

### Feature B: Market Data Simulator (Demo Value)
Auto-submit random orders on a schedule (like a market simulator).
- `MarketSimulatorService.java` with `@Scheduled`
- Generates realistic BUY/SELL orders for NIFTY50
- Creates natural-looking price movement
- Toggle: "Start Simulation" button in UI

**Why it's valuable**: Your demo site has live activity without needing real users. Shows the system actually working.

### Feature C: Trade History Export (Practical)
- `GET /api/trades/export?symbol=NIFTY50&format=csv`
- Download a CSV of all trades
- Shows you care about data access

### Feature D: Symbol Search + Watchlist
- Angular component: search symbols, add to watchlist
- LocalStorage for persistence
- Shows frontend depth

### Feature E: Gemini Trade Commentary (AI Demo Star)
After 10 trades execute for a symbol, Gemini generates a 2-sentence "trading day commentary":
*"Heavy selling pressure in NIFTY50 in the last 30 minutes pushed prices down 1.2% from 23,650 to 23,370. Buy orders have begun absorbing the selling near the support zone at 23,350."*

This is genuinely impressive in a demo — shows AI reasoning about market microstructure.

### Feature F: WebSocket Reconnection Logic (Production Essential)
Angular automatically reconnects WebSocket if the connection drops. Already partially done in Day 7, but make it robust:
- Exponential backoff (2s, 4s, 8s, 16s, max 60s)
- Visual indicator: "Live" vs "Reconnecting..."
- Queue missed trades and backfill on reconnect

### Feature G: Rate of Change Alerts
- When price moves >1.5% in 5 minutes, publish an alert to Kafka
- Angular receives it via WebSocket
- Shows as a banner in the UI: "⚠️ NIFTY50 moved +1.8% in last 5 minutes"

---

## 10. TESTING STRATEGY

### Unit Tests (Always run locally)

```java
// MatchEngineTest.java — these are the core tests
class MatchEngineTest {
    MatchEngine engine = new MatchEngine();

    @Test void exactMatch() { /* one BUY + one SELL at same price = 1 trade */ }
    @Test void partialFill() { /* BUY 100, SELL 50 = partial fill, remainder in book */ }
    @Test void marketOrderFillsAtAnyPrice() { /* MARKET BUY fills against best ask */ }
    @Test void limitOrderNoMatchIfPriceTooLow() { /* BUY at 23000 against SELL at 24000 = no match */ }
    @Test void priceTimePriority() { /* earlier order at same price gets priority */ }
    @Test void cancelOrderRemovedFromBook() { /* cancel removes order from queue */ }
    @Test void multiplePartialFills() { /* BUY 300 matched against three SELL 100 orders */ }
    @Test void emptyBookNoMatch() { /* single order, no counterpart = stays in book */ }
}
```

### Integration Tests (Run in CI)

```java
@SpringBootTest
@EmbeddedKafka  // no Docker needed
@AutoConfigureWebTestClient
class OrderFlowIntegrationTest {

    @Test
    void submitOrderFlowsToMatchEngine() {
        // POST order → Kafka → engine → trade → DB
        webTestClient.post()
            .uri("/api/orders")
            .bodyValue(testOrder)
            .exchange()
            .expectStatus().isAccepted()
            .expectBody(OrderResponse.class)
            .value(response -> assertNotNull(response.getOrderId()));
    }
}
```

### Load Testing (No Gatling needed — use loader.io)

1. Go to https://loader.io
2. Sign up free
3. Add a test: `GET https://api.equitylabs.in/actuator/health`
4. Set: 1000 clients over 60 seconds
5. Run test, download report

For more serious load testing on local machine:
```bash
# Apache Bench (built-in on macOS)
ab -n 10000 -c 200 -T application/json \
   -p order.json \
   -m POST \
   https://api.equitylabs.in/api/orders
```

### AI Testing (Manual)

Test each Gemini prompt manually:
```bash
# Explain order
curl -X POST https://api.equitylabs.in/api/ai/explain-order \
  -d '{"symbol":"NIFTY50","quantity":100,"price":23500,"orderType":"BUY","orderCategory":"LIMIT"}'

# Market summary
curl https://api.equitylabs.in/api/ai/market-summary/NIFTY50

# Price suggestion
curl https://api.equitylabs.in/api/ai/suggest-price/NIFTY50/BUY
```

---

## 11. INTERVIEW TALKING POINTS

### The Perfect Answer (5 minutes, memorize this)

> "I built EquityLabs — a production order matching engine available live at equitylabs.in.
>
> It's what powers stock exchanges. Clients submit BUY and SELL orders via REST. They queue in Kafka — I chose Kafka because it makes the system recoverable: if the engine restarts, no orders are lost. The matching engine itself uses concurrent priority queues — buys sorted highest-price-first, sells lowest-price-first. When a match happens, a trade is created and streamed in real-time to subscribers via WebSocket.
>
> The interesting architectural decision was using Spring WebFlux instead of traditional Spring MVC. At scale, thread-per-request breaks — you'd need hundreds of thousands of threads. WebFlux uses an event loop with 10-20 threads handling all concurrent connections. That's how I can demo it on a Railway $5/month server.
>
> I added an AI layer using Gemini 1.5 Flash. It's genuinely useful — not decorative. It explains your order in plain English as you fill the form, detects anomalous price spikes in the trade feed, and generates a market brief every 5 minutes. I cache all AI responses in Redis to avoid repeat API calls for the same prompt.
>
> Everything is live: equitylabs.in for the Angular UI, api.equitylabs.in for the backend, PostgreSQL on Railway, Redis and Kafka on Upstash's free serverless tier. Deployed via GitHub Actions — push to main, tests run, then auto-deploys.
>
> Here's the live demo. Here's the GitHub. Here's the Swagger API docs."

---

### Questions They'll Ask (And Your Answers)

**Q: Why Kafka instead of a direct async call?**  
A: "Direct async calls are still coupled — if the matching engine is slow, the REST handler backs up. Kafka gives you true decoupling. More importantly, Kafka is durable — if the engine crashes during processing, the order is still in Kafka and will be replayed when it restarts. That's non-negotiable for financial systems where losing an order means real money."

**Q: What's the time complexity of your matching algorithm?**  
A: "Each order insertion is O(log n) using a priority queue. Each match attempt is O(log n) for the peek + O(log n) for the pop. Total for processing one order: O(k log n) where k is the number of trades that happen. In practice, k is usually 0 or 1 for limit orders. Market orders can have k up to the book size, but even then it's bounded by the number of resting orders."

**Q: How would you scale this to handle Zerodha's 8 million orders/day?**  
A: "8 million orders/day is about 100 orders/second average — easily handled by a single instance. Peaks around market open/close might be 10-50x that. I'd scale horizontally by symbol: partition Kafka by symbol, have each engine instance own a subset of symbols. This avoids distributed state problems because each order book is isolated to one symbol. Add more engine replicas = handle more symbols. Database writes go to PostgreSQL with connection pooling. Redis handles all hot path reads."

**Q: What does the AI layer actually add?**  
A: "Three things. First, order explanation makes the system accessible to non-experts — a useful feature for any retail trading platform. Second, anomaly detection is real surveillance logic — detecting price spikes and volume surges that might indicate unusual activity. Third, it demonstrates I understand how to integrate AI as a component in a larger system, not as a toy. I'm using Gemini 1.5 Flash — 1M free tokens/day — and caching responses in Redis so repeated queries cost nothing."

**Q: What breaks first at 10x load?**  
A: "Database. PostgreSQL is the bottleneck under write-heavy load. I'd add a write buffer — accumulate trades in Redis and batch-write to PostgreSQL every second. That reduces DB writes by ~100x. Second bottleneck: Kafka consumer lag if the engine can't keep up with producers. Fix: more Kafka partitions = more parallel consumer threads. WebSocket connections are not a bottleneck — each is just a reactive stream in WebFlux, no per-connection thread."

---

### What Makes This Different From A CRUD App

Say this directly in interviews:
> "Most REST APIs read from and write to a database. This engine has a matching algorithm at its core, an event bus for async processing, and real-time streaming. The complexity isn't in the database schema — it's in the concurrent data structures, the ordering guarantees, and the performance characteristics of the event loop. That's a fundamentally different class of problem."

---

## APPENDIX: USEFUL LINKS

| Resource | URL |
|----------|-----|
| Spring Initializr | https://start.spring.io |
| Upstash Console | https://console.upstash.com |
| Gemini API Studio | https://aistudio.google.com |
| Railway Dashboard | https://railway.app |
| Vercel Dashboard | https://vercel.com |
| Cloudflare DNS | https://dash.cloudflare.com |
| Spring WebFlux Docs | https://docs.spring.io/spring-framework/reference/web/webflux.html |
| Spring Kafka Docs | https://spring.io/projects/spring-kafka |
| Spring Data R2DBC | https://spring.io/projects/spring-data-r2dbc |
| Lightweight Charts (TradingView) | https://tradingview.github.io/lightweight-charts/ |
| Angular Material | https://material.angular.io |
| Resilience4j Docs | https://resilience4j.readme.io |
| Zerodha Tech Blog | https://zerodha.tech |
| Micrometer Docs | https://micrometer.io |
| Loader.io (free load test) | https://loader.io |

---

## COST SUMMARY

| Service | Free Tier | What You Use | Paid Plan |
|---------|-----------|--------------|-----------|
| Railway | $5 trial | Spring Boot + PostgreSQL | $5/month (Hobby) |
| Upstash Redis | 10k req/day | Order caching, AI cache | Free (demo scale) |
| Upstash Kafka | 10k msg/day | Order events, trade events | Free (demo scale) |
| Vercel | Unlimited static | Angular UI | Free |
| GitHub | Unlimited public | Source + CI/CD | Free |
| Gemini API | 1.5M tokens/day | AI features | Free |
| Cloudflare DNS | Free | equitylabs.in DNS | Free |
| **TOTAL** | | | **~$5/month** |

---

*End of EquityLabs Trading Engine Blueprint*  
*equitylabs.in — Built to impress. Built to last.*
