# developer-service


## Create DB

```
mysql -h 127.0.0.1 -P 3306 -u root -p

CREATE DATABASE developer_service_db;

CREATE USER 'userdev'@'localhost' IDENTIFIED BY 'devpassword';
​
GRANT ALL PRIVILEGES ON developer_service_db.* TO 'userdev'@'localhost';

ALTER USER 'userdev'@'localhost' IDENTIFIED WITH mysql_native_password BY 'devpassword';

CREATE USER 'userdev'@'%' IDENTIFIED BY 'devpassword';
​
GRANT ALL PRIVILEGES ON developer_service_db.* TO 'userdev'@'%';
​
ALTER USER 'userdev'@'%' IDENTIFIED WITH mysql_native_password BY 'devpassword';

FLUSH PRIVILEGES;
```

## Import database dump

```
mysql developer_service_db --host=127.0.0.1 --port=3306 -u root -p < dump.sql
```


# Configure env

Add .env file in the root folder with:

```
DATABASE_URI=developer_service_db
DATABASE_NAME=developer_service_db
DATABASE_USER=userdev
DATABASE_PASS=devpassword
APTOIDE_API_BASE_URL=http://ws75.aptoide.com/api/7
```