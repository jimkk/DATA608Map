import json
import re
import math

geo_array = []

def json_readr(file):
    for line in open(file, "r"):
        yield json.loads(line)

for a in json_readr("trips_per_year.json"):
    try:
        if a["year"] == 2018 and a["start station latitude"] != "0.0":
            lon = round(float(a["start station longitude"]),6)
            lat = round(float(a["start station latitude"]),6)
            color = math.log(a["count"]) // 2
            geo_array.append(dict(type="Feature",
            geometry=dict(type="Polygon",coordinates=[[
                [round(lon-0.001,6),round(lat-0.001,6)],
                [round(lon+0.001,6),round(lat-0.001,6)],
                [round(lon+0.001,6),round(lat+0.001,6)],
                [round(lon-0.001,6),round(lat+0.001,6)],
                [round(lon-0.001,6),round(lat-0.001,6)]]]),
            properties=dict(name=a["start station id"],year=a["year"],count=a["count"], countcat=color)))
    except:
        pass
json.dump(dict(type="FeatureCollection", features=geo_array), open("trips_per_year.geojson", "w"))
# print(",".join([x['year'] for x in json_readr("trips_per_year.json")]))