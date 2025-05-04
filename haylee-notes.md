# Notes
This repository is massive and so I've decided to use this markdown to keep track of places that will need our attention for various tasks

- [Notes](#notes)
  - [Scoring](#scoring)
  - [Extract, Transform, Load](#extract-transform-load)
  - [Where's the Data?](#wheres-the-data)
  - [Tiling and Viewing Data on the Map](#tiling-and-viewing-data-on-the-map)
  - [Front End Aesthetics](#front-end-aesthetics)
  - [Adding a Layer to the Application](#adding-a-layer-to-the-application)
    - [Back end](#back-end)
    - [Front end](#front-end)
  - [Poetry](#poetry)
  - [Tribal Data](#tribal-data)
  - [Miscellaneous](#miscellaneous)


## Scoring

- `data/data-pipeline/data_pipeline/etl/score/etl_score.py` houses the bulk of merging the datasets and calculating the actual score. It feels like the output of this should be the `usa.csv` with everything. `~/etl/score/etl_utils.py` handles the generation of the codebook and the actualy converting to csv, xlsx, shp, etc. 

## Extract, Transform, Load

- Every dataset in `data/data-pipeline/data_pipeline/etl/sources` has an `etl.py` file. This file **defines a subclass of `ExtractTransformLoad` that is unique to that dataset.** 

    For instance, `~etl/sources/nlcd_nature_deprived/etl.py` defines a specific ETL class for the Nature Deprived Communities dataset. It builds off of the template `ExtractTransformLoad` class but tunes specific variables to meet the needs of this dataset. Every dataset CEJST uses has its own ETL subclass customized to that data.

    In essence, rather than manually typing out the data wrangling and processing, CEJST uses the ETL framework to make all of the data management robust and reproducible. It's harder to parse, but I think I'm finally starting to grasp 1. Where the data is and 2. What they're doing with it. 

## Where's the Data?

- `data/data-pipeline/settings.toml` houses the Amazon AWS links to the data. Neither version 1 nor version 2 links work.

- `data/data-pipeline/data_pipeline/tests/sources` houses small versions of the actual data files that are outputted during the ETL process. Used for testing. These datasets are missing from the full version of the data pipeline. 

    I think it's possible to shorten the data pipeline by truncating the initial pull from AWS. If we can modify where it starts the process from the sources outputted from ETL, I think we can get the app back up and running with the DAC layer...


## Tiling and Viewing Data on the Map

- `client/VIEW_MAP_DATA.md` has detailed instructions on understanding how the map gets data via PBF files. It also contains troubleshooting information if the data isn't loading, a good place to start for fixing the missing tiles post new administration.
- `data/data-pipeline/data_pipeline/tile/generate.py`: Path for generating tiles
- `client/src/data/mapStyle.tsx`: Path for map styling tileserver
- `client/src/components/MapTractLayers/MapTractLayers.tsx`: Path for the map layers
- `data/data-pipeline/data_pipeline/etl/score/etl_score_geo.py`: Path for making high and low json??

## Front End Aesthetics
- `client/src/pages/index.tsx`: The home page of the application

- `client/src/data/copy/explore.tsx`: Where the text for the home page lives. All the text is housed in separate little chunks inside of larger functions. This also includes the text that shows up interactively as you click around the map. 

- `client/src/components/J40Header/J40Header.tsx`: Changing header stuff, including logo

## Adding a Layer to the Application

### Back end

- `docs/operations/artifacts.md`: Shows repository structure for what files get generated at every step of the process!! 

Files to check:

- `data/data-pipeline/data_pipeline/score/adding_variables_to_score.md` is the markdown with information about important files to check and modify when adding data. Will need to modify to fit our needs, but it's a good start. 

- `data/data-pipeline/data_pipeline/tile/generate.py`: File for generating tiles. Modified to fit our usa high and low geojsons

- `data/data-pipeline/data_pipeline/config.py`: has the configurations for the data_pipeline. Includes the very first `import data_pipeline`. Also, can change the `DYNACONF` enviornment here? Currently the default is set to the AWS bucket, but we might be able to change that in `data/data-pipeline/settings.toml`. 

- `data/data-pipeline/data_pipeline/etl/score/constants.py`: All the names for the environment variables. Constants file that has all the file paths where data gets stored and outputted during data pipeline. Also contains this front-end info
```{python}
# The following constants and fields get used by the front end to change the side panel.
# The islands, Puerto Rico and the nation all have different
# data available, and as a consequence, show a different number of fields.

# Controlling Tile user experience columns
THRESHOLD_COUNT_TO_SHOW_FIELD_NAME = "THRHLD"
TILES_ISLAND_AREAS_THRESHOLD_COUNT = 3
TILES_PUERTO_RICO_THRESHOLD_COUNT = 10
TILES_NATION_THRESHOLD_COUNT = 21  
```

Added these values to `constants.py`:
```
TILES_SCORE_COLUMNS = {
    # ADD FIELD NAMES FOR GEODA DATA 
    field_names.GI_STAR_BURDEN: "GIS_BURD",
    field_names.PSIM_BURDEN: "P_BURD",
    field_names.GI_STAR_INDICATOR: "GIS_IND",
    field_names.PSIM_INDICATOR: "P_IND",
```

Added these values to `data/data-pipeline/data_pipeline/score/field_names.py`:
```
# ADDING GI STAR DATA AND ADDITIVE DATA
GI_STAR_BURDEN = 'GI Star Burdens'
PSIM_BURDEN = 'P-value Burdens'
GI_STAR_INDICATOR = 'GI Star Indicators'
PSIM_INDICATOR = 'P-value Indicators'
```

### Front end

Started adding the GI Star layer in `client/src/components/MapTractLayers/MapTractLayers.tsx` with edits in `client/src/data/constants.tsx`. Got it to show up in the high zoom, but can't make it show up on low zoom yet because the low geojson only has geometries and score. We'll need to rerun that section of the data pipeline and modify the low creation so it also stores these values. 

- `client/node_modules/@types/node/process.d.ts` where `process.env` constants are coming from I think? This is a file that allows typescript to work with Node.js. Since typescript is stricter about types than java, this helps define some type properties so the two can work together. Most (all?) of this file gets generated when you import node modules (????)

- `client/src/components/J40Map.tsx`: Added high zoom new layer IDs near the bottom of this doc to try and make new layers interactive. 

- `client/src/components/mapInfoPanel.tsx` is the parent container that controls which side panel is displayed. Right now, there are two options. Either the default `client/src/components/SidePanelInfo/SidePanelInfo.tsx` that shows up on load, or the `client/src/components/AreaDetail/AreaDetail.tsx` that shows up when you click on a tract. Planning to add a new sidepanel component and then add it to the layer selection options.
  

## Poetry

Run poetry install to install dependencies. Poetry is a dependency management tool for Python. It allows you to declare the libraries your project depends on and it will manage (install/update) them for you.
- `poetry.lock` is a file that poetry uses to lock the versions of the dependencies. It ensures that everyone working on the project has the same versions of the libraries installed.

How to run poetry and the pipeline?
- navigate to `data/data-pipeline`
- `poetry install` will spin up the virtual environment and install all the dependencies
- `poetry env activate`, make sure it's the right python version (mine has been 3.10, you can check by running `which python`)
- `poetry run python3 data_pipeline/application.py` will give you a list of commands you can run for individual parts of the pipeline. The full list of commands and arguments can be found at `data/data-pipeline/README.md`
- If you can't activate the right version (which happened to me before), you can always source the file yourself like so `source /Users/YOUR-USERNAME/Library/Caches/pypoetry/virtualenvs/justice40-data-pipeline-X9SY8ec--py3.10/bin/activate`

## Tribal Data

- `data/data-pipeline/data_pipeline/etl/sources/tribal/etl.py` etl file that has the three data sources and the download links to the S3 bucket. 
- `data/data-pipeline/data_pipeline/etl/sources/tribal_overlap/etl.py`: tribal overlap calculates the percentage of the census tract that is within the tribal area. These are the columns we see when we look at the current data frames we have. I couldn't find a single column that was just tribal: yes/no.
- Also when calculating the score, only the tribal overlap etl is imported, not the regular tribal etl. 

## Miscellaneous

- `data/data-pipeline/data_pipeline/etl/score/constants.py` contains the column names of the geo data frame. They're also in the codebook, but this is where they're defined. 

- `data/data-pipeline/data_pipeline/etl/sources/geo_utils.py`: Utililities for turning geographies into tracts using census data

All environment variable paths are at 
`client/env.development`
