DROP TABLE IF EXISTS households;
DROP TABLE IF EXISTS real_estate;

CREATE TABLE households (
    ZIP VARCHAR(10),
    Geography VARCHAR(255),
    "Geographic Area Name" VARCHAR(255),
    Households INT,
    "Households Margin of Error" INT,
    "Households Household Income in the Past 12 Months" DECIMAL,
    Year INT
);

CREATE TABLE real_estate (
    brokered_by VARCHAR(255),
    status VARCHAR(255),
    price DECIMAL,
    bed FLOAT,
    bath DECIMAL,
    acre_lot DECIMAL,
    street VARCHAR(255),
    city VARCHAR(255),
    state VARCHAR(255),
    zip_code VARCHAR(10) , 
    house_size DECIMAL
);

SELECT 
    h.*, 
    r.*
FROM 
    households h
JOIN 
    real_estate r 
ON 
    h.ZIP = r.zip_code;
SELECT 
    h.Geography, 
    h."Geographic Area Name", 
    h.Households, 
    h."Households Margin of Error", 
    h."Households Household Income in the Past 12 Months", 
    h.Year,
    r.brokered_by,
    r.status,
    r.price,
    r.bed,
    r.bath,
    r.acre_lot,
    r.street,
    r.city,
    r.state,
    r.zip_code,
    r.house_size
FROM 
    households h
JOIN 
    real_estate r 
ON 
    h.ZIP = r.zip_code;
	
	
