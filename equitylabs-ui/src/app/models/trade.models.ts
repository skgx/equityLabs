export enum OrderType {
    BUY = 'BUY',
    SELL = 'SELL'
}

export enum OrderCategory {
    LIMIT = 'LIMIT',
    MARKET = 'MARKET'
}

export interface Order {
    orderId: string;
    userId: string;
    symbol: string;
    quantity: number;
    remainingQty: number;
    price: number;
    orderType: OrderType;
    orderCategory: OrderCategory;
    status: string;
    createdAt: string;
    updatedAt: string;
}

export interface Trade {
    tradeId: string;
    symbol: string;
    buyOrderId: string;
    sellOrderId: string;
    buyUserId: string;
    sellUserId: string;
    executedPrice: number;
    quantity: number;
    tradedAt: string;
}

export interface OrderRequest {
    userId: string;
    symbol: string;
    quantity: number;
    price: number;
    orderType: OrderType;
    orderCategory: OrderCategory;
}

export interface OrderResponse {
    orderId: string;
    status: string;
    message: string;
}

export interface ExplainOrderRequest {
    symbol: string;
    quantity: number;
    price: number;
    orderType: OrderType;
    orderCategory: OrderCategory;
}

export interface ExplainOrderResponse {
    symbol: string;
    explanation: string;
}
