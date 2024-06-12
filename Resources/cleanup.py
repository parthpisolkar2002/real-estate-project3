import pandas as pd
import numpy as np

# Path to the CSV file
pathname = "realtor.csv"

# Load the CSV file into a DataFrame
df = pd.read_csv(pathname)

# Display the first few rows of the DataFrame
#print(df.head())
df_clean1 = df.drop(columns=['prev_sold_date'])
df_clean2 = df_clean1.dropna()
nynjct = ['New York', 'New Jersey', 'Connecticut']
df_states = df_clean2[df_clean2['state'].isin(nynjct)]

print(f"{len(df_states)}")

cleaned_path = "/Users/parthpisolkar/Desktop/Bootcamp Materials/real-estate-project3/realtor_cleaned.csv"
df_states.to_csv(cleaned_path, index=False)