-- V2: Users Table for Authentication

CREATE TABLE users (
    user_id         VARCHAR(50)     PRIMARY KEY,
    full_name       VARCHAR(100)    NOT NULL,
    email           VARCHAR(100)    NOT NULL UNIQUE,
    username        VARCHAR(50)     NOT NULL UNIQUE,
    password        VARCHAR(255)    NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
