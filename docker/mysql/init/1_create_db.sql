DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS users;

CREATE TABLE users
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR (255) NOT NULL,
  password VARCHAR(60) NOT NULL,
 comment VARCHAR(60) NOT NULL
);

CREATE TABLE messages
(
  id BIGINT AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT NOT NULL,
  message VARCHAR(60) NOT NULL,
  created_at TIMESTAMP (3) NULL,
  updated_at TIMESTAMP(3) NULL,
  CONSTRAINT FK_CONSULTER_USER_ID
    FOREIGN KEY (user_id) REFERENCES users (id)
);

insert into users values (1,'sample','sample','sample');
insert into messages values (1,1,'testmessage',now(),now());