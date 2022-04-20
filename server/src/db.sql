create table users(
    user_id serial PRIMARY KEY,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    created_at timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
);