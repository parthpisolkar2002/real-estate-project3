update real_estate re
set zip_code=SUBSTRING(zip_code,1,length(zip_code)-2)
