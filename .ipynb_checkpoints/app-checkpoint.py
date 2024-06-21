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
select right(geography,5) as zip_code , Geography ,"households" as households,"Households Margin of Error" as margin, "Households Household Income in the Past 12 Months" as income, year,
real_estate.status,real_estate.price, real_estate.bed,real_estate.city,real_estate.acre_lot,real_estate.house_size
from households   join real_estate on zip_code=real_estate.zip_code
limit 100;

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
app = Flask(__name__)





#Data route
@app.route("/")
def home():
    return ("Welcome to the 'Tri-state Houshold' page!:<br/>"
            f"Available Routes:<br/>"
            f"/api/v1.0/data <br/>"    
            )


@app.route("/api/v1.0/data")
def data():
    try:
        print("Server received request for 'data' page...")
    #result= pd.read_sql_query(household_query, conn)
    
    #household_df['zip_code'] = household_df['zip']
    #real_estate_df['zip_code'] = real_estate_df['zip_code'].astype(int)
    #household_df['zip_code'] = household_df['zip_code'].astype(int)

    #merged_df = pd.merge (household_df, real_estate_df, on = "zip_code", how = "inner")
        joint_df=pd.read_sql_query(Join_query,conn)
        joined_dict=joint_df.to_dict(orient='records')
        
        return jsonify(joined_dict)
    except Exception as e:
        return str(e)  # Return the error message if an exception occurs








if __name__ == "__main__":
    app.run(debug=True)


