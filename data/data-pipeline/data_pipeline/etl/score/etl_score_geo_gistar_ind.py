import concurrent.futures
import math
import os

import geopandas as gpd
import numpy as np
import pandas as pd
from data_pipeline.etl.base import ExtractTransformLoad
from data_pipeline.etl.score import constants
from data_pipeline.etl.score.etl_utils import check_score_data_source
from data_pipeline.etl.sources.census.etl_utils import check_census_data_source
from data_pipeline.score import field_names
from data_pipeline.utils import get_module_logger
from data_pipeline.etl.datasource import DataSource

logger = get_module_logger(__name__)


class GeoScoreGIStarIndETL(ExtractTransformLoad):
    """
    A class used to generate per state and national GeoJson files with the score baked in
    """

    def __init__(self, data_source: str = None):
        self.DATA_SOURCE = data_source
        self.SCORE_GEOJSON_PATH = self.DATA_PATH / "score" / "geojson" / "gistar" / "ind"
        self.SCORE_LOW_GEOJSON = self.SCORE_GEOJSON_PATH / "usa-low-gistar-ind.json"
        self.SCORE_HIGH_GEOJSON = self.SCORE_GEOJSON_PATH / "usa-high-gistar-ind.json"
        
        logger.debug(f"SCORE_GEOJSON_PATH: {self.SCORE_GEOJSON_PATH}")
        logger.debug(f"SCORE_HIGH_GEOJSON: {self.SCORE_HIGH_GEOJSON}")
        logger.debug(f"SCORE_LOW_GEOJSON: {self.SCORE_LOW_GEOJSON}")
        # self.SCORE_SHP_PATH = self.DATA_PATH / "score" / "shapefile"
        # self.SCORE_SHP_FILE = self.SCORE_SHP_PATH / "usa.shp"

        self.SCORE_CSV_PATH = self.DATA_PATH / "score" / "csv"
        self.TILE_SCORE_CSV = self.SCORE_CSV_PATH / "tiles" / "usa.csv"

        self.CENSUS_USA_GEOJSON = constants.DATA_CENSUS_GEOJSON_FILE_PATH

        # Import the shortened name for Score N to be used on tiles.
        # We should no longer be using PFS

        ## TODO: We really should not have this any longer changing
        self.TARGET_SCORE_SHORT_FIELD = constants.TILES_SCORE_COLUMNS[
            field_names.PSIM_INDICATOR
        ]
        self.TARGET_SCORE_RENAME_TO = "P_IND"

        # Import the shortened name for tract ("GTF") that's used on the tiles.
        self.TRACT_SHORT_FIELD = constants.TILES_SCORE_COLUMNS[
            field_names.GEOID_TRACT_FIELD
        ]
        self.GEOMETRY_FIELD_NAME = "geometry"
        self.LAND_FIELD_NAME = "ALAND10"

        # We will adjust this upwards while there is some fractional value
        # in the score. This is a starting value.
        self.NUMBER_OF_BUCKETS = 10
        self.HOMOGENEITY_THRESHOLD = 200
        self.HIGH_LOW_ZOOM_CENSUS_TRACT_THRESHOLD = 150

        self.geojson_usa_df: gpd.GeoDataFrame
        self.score_usa_df: pd.DataFrame
        self.geojson_score_usa_high: gpd.GeoDataFrame
        self.geojson_score_usa_low: gpd.GeoDataFrame

    def get_data_sources(self) -> [DataSource]:
        return (
            []
        )  # we have all prerequisite sources locally as a result of generating the previous steps in the pipeline

    def extract(self, use_cached_data_sources: bool = False) -> None:

        # check census data
        check_census_data_source(
            census_data_path=self.DATA_PATH / "census",
            census_data_source=self.DATA_SOURCE,
        )

        # check score data
        check_score_data_source(
            score_csv_data_path=self.SCORE_CSV_PATH,
            score_data_source=self.DATA_SOURCE,
        )

        logger.info("Reading US GeoJSON")
        full_geojson_usa_df = gpd.read_parquet(
            self.CENSUS_USA_GEOJSON,
            columns=[
                self.GEOID_FIELD_NAME,
                self.GEOMETRY_FIELD_NAME,
                self.LAND_FIELD_NAME,
            ],
        )

        # We only want to keep tracts to visualize that have non-0 land
        self.geojson_usa_df = full_geojson_usa_df[
            full_geojson_usa_df[self.LAND_FIELD_NAME] > 0
        ]

        logger.info("Reading tile score CSV")
        self.score_usa_df = pd.read_csv(
            self.TILE_SCORE_CSV,
            dtype={
                self.TRACT_SHORT_FIELD: str,
            },
            low_memory=False,
        )

    def transform(self) -> None:
        # Rename GEOID10_TRACT to GEOID10 on score to allow merging with Census GeoJSON
        self.score_usa_df.rename(
            columns={self.TRACT_SHORT_FIELD: self.GEOID_FIELD_NAME},
            inplace=True,
        )

        logger.info("Pruning Census GeoJSON")
        fields = [self.GEOID_FIELD_NAME, self.GEOMETRY_FIELD_NAME]

        # TODO update this join
        logger.info("Merging and compressing score csv with USA GeoJSON")
        self.geojson_score_usa_high = self.score_usa_df.set_index(
            self.GEOID_FIELD_NAME
        ).merge(
            self.geojson_usa_df[fields].set_index(self.GEOID_FIELD_NAME),
            left_index=True,
            right_index=True,
            how="left",
        )

        # missing_geom = self.geojson_score_usa_high["geometry"].isnull().sum()
        # total = len(self.geojson_score_usa_high)
        # logger.warning(f"Missing geometries: {missing_geom} / {total} ({missing_geom / total:.2%})")

        # Optional hard fail
        # assert missing_geom == 0, "Some geometries failed to merge!"


        self.geojson_score_usa_high = gpd.GeoDataFrame(
            self.geojson_score_usa_high, crs="EPSG:4326"
        )
        # Check for null geometries
        missing_ids = self.geojson_score_usa_high[
        self.geojson_score_usa_high["geometry"].isnull()
        ].index.tolist()

        logger.warning(f"Dropping {len(missing_ids)} tracts with null geometry. Example: {missing_ids[:5]}")

        # REMOVE NULL GEOMETRIES!! 
        self.geojson_score_usa_high = self.geojson_score_usa_high[
        self.geojson_score_usa_high["geometry"].notnull()
        ]

        # logger.warning("geojson_score_usa_high geometry nulls: %s", self.geojson_score_usa_high["geometry"].isnull().sum())
        # logger.warning("geojson_score_usa_high total rows: %s", len(self.geojson_score_usa_high))


        usa_simplified = self.geojson_score_usa_high[
            [
                self.TARGET_SCORE_SHORT_FIELD,
                self.GEOMETRY_FIELD_NAME,
            ]
        ].reset_index()

        usa_tracts = usa_simplified.rename(
            columns={self.TARGET_SCORE_SHORT_FIELD: self.TARGET_SCORE_RENAME_TO}
        )

        logger.info("Converting GeoJSON into GeoDataFrame with tracts")
        usa_tracts = gpd.GeoDataFrame(
            usa_tracts,
            columns=[
                self.TARGET_SCORE_RENAME_TO,
                self.GEOMETRY_FIELD_NAME,
                self.GEOID_FIELD_NAME,
            ],
            crs="EPSG:4326",
        )

        logger.debug("Creating buckets from tracts")
        usa_bucketed, keep_high_zoom_df = self._create_buckets_from_tracts(
            usa_tracts, self.NUMBER_OF_BUCKETS
        )
        logger.warning("usa_bucketed: %s", len(usa_bucketed))
        logger.warning("keep_high_zoom_df: %s", len(keep_high_zoom_df))

        logger.debug("Aggregating buckets")
        usa_aggregated = self._aggregate_buckets(usa_bucketed, agg_func="mean")
        try: 
            logger.debug("Breaking up polygons")
            compressed = self._breakup_multipolygons(
                usa_aggregated, self.NUMBER_OF_BUCKETS
            )

            self.geojson_score_usa_low = self._join_high_and_low_zoom_frames(
                compressed, keep_high_zoom_df
            )
            logger.debug(f"Low zoom GeoJSON: {self.geojson_score_usa_low.head()}")

            # Ensure the new columns got added
            logger.debug(f"Columns in low zoom GeoJSON: {self.geojson_score_usa_low.columns}")

            # round to 2 decimals
            self.geojson_score_usa_low = self.geojson_score_usa_low.round(
                {self.TARGET_SCORE_RENAME_TO: 2}
            )

            logger.debug(f"geojson_score_usa_high: {self.geojson_score_usa_high.head()}")
            logger.debug(f"geojson_score_usa_low: {self.geojson_score_usa_low.head()}")
        except Exception as e:
            logger.error(f"Error during transform: {e}", exc_info=True)
            raise

    def _create_buckets_from_tracts(
        self, initial_state_tracts: gpd.GeoDataFrame, num_buckets: int
    ):
        # Assert statement for null geometries
        assert initial_state_tracts["geometry"].notnull().all(), "Some geometries are null at bucket creation!"

        # First, we remove any states that have under the threshold of census tracts
        # from being aggregated (right now, this just removes Wyoming)
        highzoom_state_tracts = initial_state_tracts.reset_index()
        highzoom_state_tracts["state"] = highzoom_state_tracts[
            self.GEOID_FIELD_NAME
        ].str[:2]
        keep_high_zoom = highzoom_state_tracts.groupby("state")[
            self.GEOID_FIELD_NAME
        ].transform(
            lambda x: x.count() <= self.HIGH_LOW_ZOOM_CENSUS_TRACT_THRESHOLD
        )
        assert (
            keep_high_zoom.sum() != initial_state_tracts.shape[0]
        ), "Error: Cutoff is too high, nothing is aggregated"
        assert keep_high_zoom.sum() > 1, "Error: Nothing is kept at high zoom"


        # Then we assign buckets only to tracts that do not get "kept" at high zoom
        state_tracts = initial_state_tracts[~keep_high_zoom].copy()
        state_tracts[f"{self.TARGET_SCORE_RENAME_TO}_bucket"] = np.arange(
            len(state_tracts)
        )

        # Assign temporary bucket column
        state_tracts[f"{self.TARGET_SCORE_RENAME_TO}_bucket"] = np.arange(
            len(state_tracts)
        )
        # assign tracts to buckets by score
        state_tracts = state_tracts.sort_values(
            self.TARGET_SCORE_RENAME_TO, ascending=True
        )
        score_bucket = []
        bucket_size = math.ceil(
            len(state_tracts.index) / self.NUMBER_OF_BUCKETS
        )

        # This just increases the number of buckets so they are more
        # homogeneous. It's not actually necessary :shrug:
        while (
            state_tracts[self.TARGET_SCORE_RENAME_TO].sum() % bucket_size
            > self.HOMOGENEITY_THRESHOLD
        ):
            self.NUMBER_OF_BUCKETS += 1
            bucket_size = math.ceil(
                len(state_tracts.index) / self.NUMBER_OF_BUCKETS
            )

        logger.debug(
            f"The number of buckets has increased to {self.NUMBER_OF_BUCKETS}"
        )
        for i in range(len(state_tracts.index)):
            score_bucket.extend([math.floor(i / bucket_size)])
        state_tracts[f"{self.TARGET_SCORE_RENAME_TO}_bucket"] = score_bucket

        logger.debug(f"Columns in state_tracts before aggregation: {state_tracts.columns}")
        logger.debug(f"Sample data in state_tracts: {state_tracts.head()}")

        return state_tracts, initial_state_tracts[keep_high_zoom]

    def _aggregate_buckets(
        self, state_tracts: gpd.GeoDataFrame, agg_func: str
    ) -> gpd.GeoDataFrame:
        keep_cols = [
            self.TARGET_SCORE_RENAME_TO,
            f"{self.TARGET_SCORE_RENAME_TO}_bucket",
            self.GEOMETRY_FIELD_NAME,
        ]

        assert state_tracts["geometry"].notnull().all(), "Null geometry before dissolve!"

        #  We dissolve all other tracts by their score bucket
        state_dissolve = state_tracts[keep_cols].dissolve(
            by=f"{self.TARGET_SCORE_RENAME_TO}_bucket", aggfunc=agg_func
        )

        assert state_dissolve["geometry"].notnull().all(), "Null geometry after dissolve!"

        logger.debug(f"Columns in state dissolve: {state_dissolve.columns}")
        logger.debug(f"Sample data in state dissolve (aggregated buckets): {state_dissolve.head()}")


        return state_dissolve

    def _breakup_multipolygons(
        self, state_bucketed_df: gpd.GeoDataFrame, num_buckets: int
    ) -> gpd.GeoDataFrame:

        compressed = []
        for i in range(num_buckets):
            for j in range(
                len(state_bucketed_df[self.GEOMETRY_FIELD_NAME][i].geoms)
            ):
                compressed.append(
                    [
                        state_bucketed_df[self.TARGET_SCORE_RENAME_TO][i],
                        state_bucketed_df[self.GEOMETRY_FIELD_NAME][i].geoms[j],
                    ]
                )

        logger.debug(f"Compressed polygons: {compressed[:5]}")  # Log the first 5 entries
        logger.debug(f"Number of compressed polygons: {len(compressed)}")

        return compressed

    def _join_high_and_low_zoom_frames(
        self, compressed: list, keep_high_zoom_df: gpd.GeoDataFrame
    ) -> gpd.GeoDataFrame:
        keep_columns = [
            self.TARGET_SCORE_RENAME_TO,
            self.GEOMETRY_FIELD_NAME,
        ]
        compressed_geodf = gpd.GeoDataFrame(
            compressed,
            columns=keep_columns,
            crs="EPSG:4326",
        )
        return pd.concat([compressed_geodf, keep_high_zoom_df[keep_columns]])

    def load(self) -> None:
        logger.info("Starting load step")

        # Ensure the directory exists
        if not self.SCORE_GEOJSON_PATH.exists():
            logger.info(f"Creating directory: {self.SCORE_GEOJSON_PATH}")
            self.SCORE_GEOJSON_PATH.mkdir(parents=True, exist_ok=True)

        # Create separate threads to run each write to disk.
        def write_high_to_file():
            logger.info("Writing usa-high (~9 minutes)")
            self.geojson_score_usa_high.to_file(
                filename=self.SCORE_HIGH_GEOJSON,
                driver="GeoJSON",
            )
            logger.info("Completed writing usa-high-gistar-ind")

         
        def write_low_to_file():
            logger.info("Writing usa-low (~9 minutes)")
            self.geojson_score_usa_low.to_file(
                filename=self.SCORE_LOW_GEOJSON, driver="GeoJSON"
            )
            logger.info("Completed writing usa-low-gistar-ind")
        
        with concurrent.futures.ThreadPoolExecutor() as executor:
            futures = {
                executor.submit(task)
                for task in [
                    write_high_to_file,
                    write_low_to_file,
                ]
            }

            for fut in concurrent.futures.as_completed(futures):
                # Calling result will raise an exception if one occurred.
                # Otherwise, the exceptions are silently ignored.
                fut.result()