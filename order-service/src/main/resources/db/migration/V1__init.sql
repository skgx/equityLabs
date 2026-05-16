-- V1: Initial Schema for Order Service

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
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_symbol_status ON orders(symbol, status);

CREATE TABLE trades (
    trade_id        VARCHAR(50)     PRIMARY KEY,
    symbol          VARCHAR(20)     NOT NULL,
    buy_order_id    VARCHAR(50)     NOT NULL REFERENCES orders(order_id),
    sell_order_id   VARCHAR(50)     NOT NULL REFERENCES orders(order_id),
    buy_user_id     VARCHAR(100)    NOT NULL,
    sell_user_id    VARCHAR(100)    NOT NULL,
    executed_price  DECIMAL(12, 2)  NOT NULL,
    quantity        INTEGER         NOT NULL,
    traded_at       TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_trades_symbol ON trades(symbol);

CREATE TABLE outbox_events (
    id              BIGSERIAL       PRIMARY KEY,
    aggregate_id    VARCHAR(50)     NOT NULL,
    aggregate_type  VARCHAR(20)     NOT NULL,
    payload         TEXT            NOT NULL,
    status          VARCHAR(20)     NOT NULL, -- PENDING, PROCESSED, FAILED
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at    TIMESTAMP
);

CREATE INDEX idx_outbox_pending ON outbox_events(status) WHERE status = 'PENDING';
