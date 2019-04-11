# DATA608Map
Deck.gl Visualization for DATA608 Final Project

Based on [deck.gl example](http://deck.gl/#/examples/core-layers/geojson-layer-polygons)

After creating the json data in spark (see notebook description), the data is then transformed into .geojson files for each year with polygons created for each station. This data is then imported into a deck.gl container with the polygons having a height and color based on the trip count values of the station.
