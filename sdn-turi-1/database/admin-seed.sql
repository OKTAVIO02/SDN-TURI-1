INSERT INTO admins (username, password_hash)
VALUES ('admin', '$2y$12$NfhFi3q1i9qwLJzzlyw.kO3pdDJRsj01xIster7rNOcMOqWQ1/9sm')
ON DUPLICATE KEY UPDATE password_hash = VALUES(password_hash);
