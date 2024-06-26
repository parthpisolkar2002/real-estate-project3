# Import the dependencies.


import numpy as np
import pandas as pd
import datetime as dt


#################################################
# Database Setup
#################################################
import psycopg2


# Establish a connection to the PostgreSQL database
conn = psycopg2.connect(
    dbname="real_estate_proj_3",
    user="postgres",        # <--------------- READ THIS
    password="Kirati2024",    # <--------------- READ THIS
    host="localhost",
    port="5432"
)

household_query = "SELECT * FROM households;"
real_estate_query = "SELECT * FROM real_estate;"
Join_query="""
        select  zip, Geography ,"households" as households,"Households Margin of Error" as margin, "Households Household Income in the Past 12 Months" as income, year,
        real_estate.status,real_estate.price, real_estate.bed,real_estate.city,real_estate.state,real_estate.acre_lot,real_estate.house_size
        ,(price/((acre_lot*43560)+1)) as sq_lot
        from households   join real_estate on zip=real_estate.zip_code
        where year='2018'  ;
"""
#joined_dable_query="select right(geography,5) as zip_code , Geography ,"households" as households,"Households Margin of Error" as margin, "Households Household Income in the Past 12 Months" as income, year,

# Execute the query and load the results into a DataFrame
household_df = pd.read_sql_query(household_query, conn)
real_estate_df = pd.read_sql_query(real_estate_query, conn)

joint_df=pd.read_sql_query(Join_query,conn)


#################################################
# Flask Setup
#################################################

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)




#Data route
@app.route("/")
def home():
    return ("Welcome to the 'Tri-state Houshold' page!:<br/>"
            f"Available Routes:<br/>"
            f"/api/v1.0/data <br/>"    
            f"/api/v1.0/income_levels <br/>"
            f"/api/v1.0/price_per_sqft <br/>"
            )


@app.route("/api/v1.0/data")
def data():
    try:
        print("Server received request for 'data' page...")
    
        Join_query="""
        select  zip, Geography ,"households" as households,"Households Margin of Error" as margin, "Households Household Income in the Past 12 Months" as income, year,
        real_estate.status,real_estate.price, real_estate.bed,real_estate.city,real_estate.state,real_estate.acre_lot,real_estate.house_size
        ,(price/((acre_lot*43560)+1)) as sq_lot
        from households   join real_estate on zip=real_estate.zip_code
        where year='2021' ;
        """
        joint_df=pd.read_sql_query(Join_query,conn)
        ##joint_df=joint_df.groupby('zip').agg({'price':'mean','households':'count'}).reset_index()
        #joint_df=joint_df.rename(columns={'households':'house','price':'Avg_price'} )
        joint_df=joint_df.groupby(['zip','city','state']).agg({'price':'mean','households':'count'}).reset_index()

        joined_dict=joint_df.to_dict(orient='records')
        return jsonify(joined_dict)
    except Exception as e:
        return str(e)  # Return the error message if an exception occurs

@app.route("/api/v1.0/income_levels")
def income_levels():
    # Write your SQL query
    household_query = "SELECT * FROM households;"
    real_estate_query = "SELECT * FROM real_estate;"

    # Execute the query and load the results into a DataFrame
    household_df = pd.read_sql_query(household_query, conn)
    real_estate_df = pd.read_sql_query(real_estate_query, conn)
    household2_df = household_df.dropna()
    #household2_df = household_df[household_df['year'] == 2018]
    household2_df
    household2_df['zip_code'] = household2_df['zip']
    real_estate_df['zip_code'] = pd.to_numeric(real_estate_df['zip_code'], errors='coerce')
    real_estate_df['zip_code'] = real_estate_df['zip_code'].astype(int)
    household2_df['zip_code'] = household2_df['zip_code'].astype(int)
    merged_df = pd.merge (household2_df, real_estate_df, on = "zip_code", how = "inner")
    household_df['zip_code'] = household_df['zip']
    household_df['zip_code'] = household_df['zip_code'].astype(int)
    merged2_df = pd.merge (household_df, real_estate_df, on = "zip_code", how = "inner")
    zipcodes = ["12207","12208", "12209", "12210", "12211", 
        "6107", "6105", "6106", "6112", "6120",
        "8608","8609", "8610", "8611", "8618"]
    household3_df = household_df[household_df['zip'].isin(zipcodes)].reset_index()
    merged2_df = pd.merge (household3_df, real_estate_df, on = "zip_code", how = "inner")
    dictionary = merged2_df.to_dict(orient='records')
    return jsonify(dictionary)

@app.route("/api/v1.0/price_per_sqft")
def price_per_sqft():
    price_per_sqft_df = pd.read_csv('sqft_price.csv')
    price_per_sqft_dict = price_per_sqft_df.to_dict(orient='records')
    return jsonify(price_per_sqft_dict)


  


if __name__ == "__main__":
    app.run(debug=True)


