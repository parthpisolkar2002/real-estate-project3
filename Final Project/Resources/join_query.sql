select  zip, Geography ,"households" as households,"Households Margin of Error" as margin, "Households Household Income in the Past 12 Months" as income, year,
real_estate.status,real_estate.price, real_estate.bed,real_estate.city,real_estate.acre_lot,real_estate.house_size
,(price/((acre_lot*43560)+1)) as sq_lot
from households   join real_estate on zip=real_estate.zip_code
where year='2018' ;
