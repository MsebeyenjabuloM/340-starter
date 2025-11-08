-- Assignment 2 - Task 1 

-- 1. Insert Tony Stark into the account table
INSERT INTO account (first_name, last_name, email, password)
VALUES ('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- 2. Update Tony Stark's account type to Admin
UPDATE account
SET account_type = 'Admin'
WHERE email = 'tony@starkent.com';

-- 3. Delete Tony Stark from the account table
DELETE FROM account
WHERE email = 'tony@starkent.com';

-- 4. Update GM Hummer description using REPLACE
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- 5. Select make, model, and classification name for Sport vehicles
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory AS i
INNER JOIN classification AS c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- 6. Update image and thumbnail paths to include /vehicles
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');
