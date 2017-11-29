CREATE DATABASE bamazon;

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

SELECT stock_quantity FROM products WHERE item_id = 4;
