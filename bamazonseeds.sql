
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
	item_id INT NOT NULL AUTO_INCREMENT,
	product_name VARCHAR (50) NOT NULL,
	department_name VARCHAR (50) NOT NULL,
	price DECIMAL (10, 2) NOT NULL,
	stock_quantity INT NOT NULL,
	PRIMARY KEY (item_id)
);

DESCRIBE products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES
("Bucket Purse", "Purses", 25.00, 20),
("Crossbody Bag", "Purses", 50.00, 70),
("Star Necklace", "Jewelry", 30.00, 40),
("Pearl Earrings", "Jewelry", 150.00, 60),
("Hex Bangle", "Jewelry", 60.00, 30),
("White Flower Flip Flops", "Shoes", 27.00, 100),
("Ballet Slippers", "Shoes", 38.00, 50),
("Striped Yoga Pants", "Clothing", 20.00, 75),
("Leather Jacket", "Clothing", 65.00, 25),
("Skull Clutch", "Purses", 75.00, 18);

CREATE TABLE departments(
	department_id INT AUTO_INCREMENT NOT NULL,
	department_name VARCHAR(50) NOT NULL,
	overhead_costs DECIMAL (10,2) NOT NULL,
	PRIMARY KEY (department_id)
);

ALTER TABLE products
ADD product_sales DECIMAL (10,2);

INSERT INTO departments (department_name, overhead_costs)
VALUES ("Accessories", 10000), ("Clothing", 15000), ("Jewelry", 12000), ("Purses", 20000), ("Shoes", 17000);
