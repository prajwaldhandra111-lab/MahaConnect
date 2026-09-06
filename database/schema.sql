CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    mobile VARCHAR(15) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE profiles (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    full_name VARCHAR(100),
    dob DATE,
    gender VARCHAR(20),
    email VARCHAR(100),
    city VARCHAR(100),
    address TEXT,
    school_college VARCHAR(150),
    board VARCHAR(50),
    current_class VARCHAR(50),
    academic_year VARCHAR(20),
    skills TEXT,
    interests TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE consents (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,

    education BOOLEAN DEFAULT FALSE,
    employment BOOLEAN DEFAULT FALSE,
    welfare BOOLEAN DEFAULT FALSE,

    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE applications (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    service_name VARCHAR(150) NOT NULL,
    department VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending',
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE notifications (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER NOT NULL,
    title VARCHAR(200),
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);


CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    user_id INTEGER,
    action VARCHAR(200) NOT NULL,
    department VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES users(id)
);