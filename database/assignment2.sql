-- 1. inserting Tony, Stark, tony@starkent.com, Iam1ronM@n into account
INSERT INTO account 
	(account_firstname, account_lastname, account_email, account_password)
VALUES
	('Tony','Stark','tony@starkent.com','Iam1ronM@n');

-- 2. updating account_type for Tony Stark
UPDATE account
SET account_type = 'Admin'
WHERE account_id = 1;

-- 3. Deleting Tony Starks Account
DELETE FROM account
WHERE account_id = 1;

-- 4. Updating GM Hummer description
UPDATE inventory
SET inv_description = REPLACE(inv_description, 'the small interiors', 'a huge interior')
WHERE inv_id = 10;

-- 5. getting make, model, and classification name for all sport classifications
SELECT inv_make, inv_model, classification_name
FROM public.inventory i
	JOIN public.classification c
	ON c.classification_id = i.classification_id
WHERE i.classification_id = 2;

-- 6. Updating all image file paths to add /vehicles
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images', '/images/vehicles'),
	inv_thumbnail = REPLACE(inv_thumbnail, '/images', '/images/vehicles');

