CREATE TABLE user_detail (
    uid INT PRIMARY KEY AUTO_INCREMENT,
    bank VARCHAR(255) NOT NULL,
    bankcode VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    pubkey VARCHAR(255) NOT NULL,
    privkey VARCHAR(255) NOT NULL
     );

