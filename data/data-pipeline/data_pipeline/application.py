import sys
import os
import pandas as pd
from pathlib import Path
from subprocess import call

import click
from data_pipeline.config import settings
from data_pipeline.etl.runner import etl_runner
from data_pipeline.etl.runner import score_generate
from data_pipeline.etl.runner import score_geo
from data_pipeline.etl.runner import score_geo_gistar_burd
from data_pipeline.etl.runner import score_geo_gistar_ind
from data_pipeline.etl.runner import score_geo_add_burd
from data_pipeline.etl.runner import score_geo_add_ind
from data_pipeline.etl.runner import score_post
from data_pipeline.etl.runner import get_data_sources
from data_pipeline.etl.runner import extract_data_sources as extract_ds
from data_pipeline.etl.runner import clear_data_source_cache as clear_ds_cache
from data_pipeline.etl.sources.census.etl_utils import check_census_data_source
from data_pipeline.etl.sources.census.etl_utils import (
    reset_data_directories as census_reset,
)
from data_pipeline.etl.sources.census.etl_utils import zip_census_data
from data_pipeline.etl.sources.tribal.etl_utils import (
    reset_data_directories as tribal_reset,
)
from data_pipeline.tile.generate import generate_tiles
from data_pipeline.tile.generate_gistar_burd import generate_tiles_gistar_burd
from data_pipeline.tile.generate_gistar_ind import generate_tiles_gistar_ind
from data_pipeline.tile.generate_add_burd import generate_tiles_add_burd
from data_pipeline.tile.generate_add_ind import generate_tiles_add_ind

from data_pipeline.etl.score import constants
from data_pipeline.utils import check_first_run
from data_pipeline.utils import data_folder_cleanup
from data_pipeline.utils import downloadable_cleanup
from data_pipeline.utils import get_module_logger
from data_pipeline.utils import score_folder_cleanup
from data_pipeline.utils import temp_folder_cleanup
from data_pipeline.utils import geo_score_folder_cleanup

logger = get_module_logger(__name__)

LOG_LINE_WIDTH = 60

use_cache_option = click.option(
    "-u",
    "--use-cache",
    is_flag=True,
    default=False,
    help="When set, will check for cached data sources to use before downloading new ones.",
)

dataset_option = click.option(
    "-d",
    "--dataset",
    required=False,
    type=str,
    help="Name of dataset to run. If not provided, all datasets will be run.",
)

data_source_option = click.option(
    "-s",
    "--data-source",
    default="local",
    required=False,
    type=str,
    help="Grab the data from either 'local' for local access or 'aws' to retrieve from Justice40 S3 repository. Default is 'local'.",
)


@click.group()
def cli():
    """Defines a click group for the commands below"""


@cli.command(help="Clean up all census data folders")
def census_cleanup():
    """CLI command to clean up the census data folder"""
    log_title("Clean Up Census Data")

    data_path = settings.APP_ROOT / "data"

    # census directories
    log_info("Cleaning up all census data")
    census_reset(data_path)

    log_goodbye()


@cli.command(help="Clean up all data folders")
def data_cleanup():
    """CLI command to clean up the all the data folders"""
    log_title("Clean Up Data ")

    data_path = settings.APP_ROOT / "data"

    log_info("Cleaning up all data folders")
    census_reset(data_path)
    data_folder_cleanup()
    downloadable_cleanup()
    score_folder_cleanup()
    temp_folder_cleanup()
    geo_score_folder_cleanup()
    tribal_reset(data_path)

    log_goodbye()


@cli.command(
    help="Census data download",
)
@click.option(
    "-zc",
    "--zip-compress",
    is_flag=True,
    help="Upload to AWS S3 a zipped archive of the census data.",
)
@use_cache_option
def census_data_download(zip_compress, use_cache):
    """CLI command to download all census shape files from the Census FTP and extract the geojson
    to generate national and by state Census Block Group CSVs"""
    log_title("Download Census Data ")

    data_path = settings.APP_ROOT / "data"
    census_reset(data_path)

    log_info("Downloading census data")
    etl_runner("census", use_cache)

    if zip_compress:
        log_info("Zipping census data")
        zip_census_data()

    log_goodbye()


@cli.command(help="Retrieve census data from source")
@data_source_option
def pull_census_data(data_source: str):

    log_title("Pull Census Data")

    log_info(f"Pulling census data from {data_source}")
    data_path = settings.APP_ROOT / "data" / "census"
    check_census_data_source(data_path, data_source)

    log_goodbye()


@cli.command(
    help="Run all ETL processes or a specific one",
)
@click.option(
    "--no-concurrency",
    is_flag=True,
    help="Run ETLs sequentially instead of concurrently.",
)
@dataset_option
@use_cache_option
def etl_run(dataset: str, use_cache: bool, no_concurrency: bool):
    """Run a specific or all ETL processes

    Args:
        dataset (str): Name of the ETL module to be run (optional)

    Returns:
        None
    """
    log_title("Run ETL")

    log_info("Running dataset(s)")
    etl_runner(dataset, use_cache, no_concurrency)

    log_goodbye()


@cli.command(
    help="Generate Score",
)
def score_run():
    """CLI command to generate the score"""
    log_title("Score", "Generate Score")

    log_info("Cleaning up data folders")
    score_folder_cleanup()

    log_info("Generating score")
    score_generate()

    log_goodbye()


@cli.command(
    help="Run ETL + Score Generation",
)
@use_cache_option
def score_full_run(use_cache: bool):
    """CLI command to run ETL and generate the score in one command"""
    log_title("Score Full Run", "Run ETL and Generate Score (no tiles)")

    log_info("Cleaning up data folders")
    data_folder_cleanup()
    score_folder_cleanup()
    temp_folder_cleanup()

    log_info("Running all ETLs")
    etl_runner(use_cache=use_cache)

    log_info("Generating score")
    score_generate()

    log_goodbye()


@cli.command(
    help="Run etl_score_post to create score csv, tile csv, and downloadable zip"
)
@data_source_option
def generate_score_post(data_source: str):
    """CLI command to generate score, tile, and downloadable files

    Args:
        data_source (str): Source for the census data (optional)
                           Options:
                           - local: fetch census and score data from the local data directory
                           - aws: fetch census and score from AWS S3 J40 data repository

    Returns:
        None
    """
    log_title(
        "Generate Score Post ", "Create Score CSV, Tile CSV, Downloadable ZIP"
    )

    log_info("Cleaning up downloadable folder")
    downloadable_cleanup()

    log_info("Running score post activities")
    score_post(data_source)

    log_goodbye()


@cli.command(help="Generate GeoJSON files with scores baked in")
@data_source_option
def geo_score(data_source: str):
    """CLI command to combine score with GeoJSON data and generate low and high files

    Args:
        data_source (str): Source for the census data (optional)
                           Options:
                           - local: fetch census and score data from the local data directory
                           - aws: fetch census and score from AWS S3 J40 data repository

    Returns:
        None
    """
    log_title(
        "Generate GeoJSON",
        "Combine Score and GeoJSON, Add Shapefile Data to Codebook",
    )

    log_info("Cleaning up geo score folder")
    geo_score_folder_cleanup()

    log_info("Combining score with GeoJSON")
    score_geo(data_source=data_source)

    log_goodbye()

@cli.command(help="Generate GeoJSON files with GI Star Burden scores baked in")
@data_source_option
def geo_score_gistar_burd(data_source: str):
    """CLI command to combine score with GeoJSON data and generate low and high files

    Args:
        data_source (str): Source for the census data (optional)
                           Options:
                           - local: fetch census and score data from the local data directory
                           - aws: fetch census and score from AWS S3 J40 data repository

    Returns:
        None
    """
    log_title(
        "Generate GeoJSON",
        "Combine Score and GeoJSON, Add Shapefile Data to Codebook",
    )

    log_info("Cleaning up geo score folder")
    geo_score_folder_cleanup()

    log_info("Combining score with GeoJSON")
    score_geo_gistar_burd(data_source=data_source) 

    log_goodbye()

@cli.command(help="Generate GeoJSON files with GI Star Indicator scores baked in")
@data_source_option
def geo_score_gistar_ind(data_source: str):
    """CLI command to combine score with GeoJSON data and generate low and high files

    Args:
        data_source (str): Source for the census data (optional)
                           Options:
                           - local: fetch census and score data from the local data directory
                           - aws: fetch census and score from AWS S3 J40 data repository

    Returns:
        None
    """
    log_title(
        "Generate GeoJSON",
        "Combine Score and GeoJSON, Add Shapefile Data to Codebook",
    )

    log_info("Cleaning up geo score folder")
    geo_score_folder_cleanup()

    log_info("Combining score with GeoJSON")
    score_geo_gistar_ind(data_source=data_source) 

    log_goodbye()

@cli.command(help="Generate GeoJSON files with Additive scores baked in")
@data_source_option
def geo_score_add_burd(data_source: str):
    """CLI command to combine score with GeoJSON data and generate low and high files

    Args:
        data_source (str): Source for the census data (optional)
                           Options:
                           - local: fetch census and score data from the local data directory
                           - aws: fetch census and score from AWS S3 J40 data repository

    Returns:
        None
    """
    log_title(
        "Generate GeoJSON",
        "Combine Score and GeoJSON, Add Shapefile Data to Codebook",
    )

    log_info("Cleaning up geo score folder")
    geo_score_folder_cleanup()

    log_info("Combining score with GeoJSON")
    score_geo_add_burd(data_source=data_source)

    log_goodbye()

@cli.command(help="Generate GeoJSON files with Additive scores baked in")
@data_source_option
def geo_score_add_ind(data_source: str):
    """CLI command to combine score with GeoJSON data and generate low and high files

    Args:
        data_source (str): Source for the census data (optional)
                           Options:
                           - local: fetch census and score data from the local data directory
                           - aws: fetch census and score from AWS S3 J40 data repository

    Returns:
        None
    """
    log_title(
        "Generate GeoJSON",
        "Combine Score and GeoJSON, Add Shapefile Data to Codebook",
    )

    log_info("Cleaning up geo score folder")
    geo_score_folder_cleanup()

    log_info("Combining score with GeoJSON")
    score_geo_add_ind(data_source=data_source)

    log_goodbye()


@cli.command(
    help="Generate map tiles. Pass -t to generate tribal layer as well.",
)
@click.option(
    "-t",
    "--generate-tribal-layer",
    default=False,
    required=False,
    is_flag=True,
    type=bool,
)
def generate_map_tiles(generate_tribal_layer):
    """CLI command to generate the map tiles"""
    log_title("Generate Map Tiles")

    data_path = settings.APP_ROOT / "data"

    log_info("Generating tiles")
    generate_tiles(data_path, generate_tribal_layer)

    log_goodbye()

@cli.command(
    help="Generate GI Star burden map tiles. Pass -t to generate tribal layer as well.",
)
@click.option(
    "-t",
    "--generate-tribal-layer",
    default=False,
    required=False,
    is_flag=True,
    type=bool,
)
def generate_map_tiles_gistar_burd(generate_tribal_layer):
    """CLI command to generate the map tiles"""
    log_title("Generate GI Star Burden Map Tiles")

    data_path = settings.APP_ROOT / "data"

    log_info("Generating Gi Star tiles")
    generate_tiles_gistar_burd(data_path, generate_tribal_layer)

    log_goodbye()

@cli.command(
    help="Generate GI Star Indicator map tiles. Pass -t to generate tribal layer as well.",
)
@click.option(
    "-t",
    "--generate-tribal-layer",
    default=False,
    required=False,
    is_flag=True,
    type=bool,
)
def generate_map_tiles_gistar_ind(generate_tribal_layer):
    """CLI command to generate the map tiles"""
    log_title("Generate GI Star Indicator Map Tiles")

    data_path = settings.APP_ROOT / "data"

    log_info("Generating Gi Star tiles")
    generate_tiles_gistar_ind(data_path, generate_tribal_layer)

    log_goodbye()


@cli.command(
    help="Generate add burden map tiles. Pass -t to generate tribal layer as well.",
)
@click.option(
    "-t",
    "--generate-tribal-layer",
    default=False,
    required=False,
    is_flag=True,
    type=bool,
)
def generate_map_tiles_add(generate_tribal_layer):
    """CLI command to generate the map tiles"""
    log_title("Generate Additive Burden Map Tiles")

    data_path = settings.APP_ROOT / "data"

    log_info("Generating Additive tiles")
    generate_tiles_add_burd(data_path, generate_tribal_layer)

    log_goodbye()

@cli.command(
    help="Generate additive indicator map tiles. Pass -t to generate tribal layer as well.",
)
@click.option(
    "-t",
    "--generate-tribal-layer",
    default=False,
    required=False,
    is_flag=True,
    type=bool,
)
def generate_map_tiles_add_ind(generate_tribal_layer):
    """CLI command to generate the map tiles"""
    log_title("Generate Additive Map Tiles")

    data_path = settings.APP_ROOT / "data"

    log_info("Generating Additive Indicator tiles")
    generate_tiles_add_ind(data_path, generate_tribal_layer)

    log_goodbye()


@cli.command(
    help="Data Full Run (Census download, ETLs, score, combine and tile generation)",
)
@click.option(
    "-c",
    "--check",
    is_flag=True,
    help="Check if data run has been run before, and don't run it if so.",
)
@data_source_option
@use_cache_option
def data_full_run(check: bool, data_source: str, use_cache: bool):
    """CLI command to run ETL, score, JSON combine and generate tiles including tribal layer in one command

    Args:
        check (bool): Run the full data run only if the first run semaphore file is not set (optional)
        data_source (str): Source for the census data (optional)
                           Options:
                           - local: fetch census and score data from the local data directory
                           - aws: fetch census and score from AWS S3 J40 data repository

     Returns:
        None
    """
    log_title("Full Run", "Census DL, ETL, Score, Combine, Generate Tiles")

    data_path = settings.APP_ROOT / "data"
    first_run = False

    if check:
        if not check_first_run():
            # check if the data full run has been run before
            first_run = True

    if first_run:
        log_info("The data full run was already executed")
        sys.exit()

    else:
        # Directory cleanup
        log_info("Cleaning up data folders")
        census_reset(data_path)
        data_folder_cleanup()
        downloadable_cleanup()
        score_folder_cleanup()
        geo_score_folder_cleanup()
        temp_folder_cleanup()
        tribal_reset(data_path)

        log_info("Downloading census data")
        etl_runner("census", use_cache)

        log_info("Running all ETLs")
        etl_runner(use_cache)

        log_info("Generating score")
        score_generate()

        log_info("Running post score")
        score_post(data_source)

        log_info("Combining score with census GeoJSON")
        score_geo(data_source)

        log_info("Generating map tiles")
        generate_tiles(data_path, False)

        log_info("Generating tribal map tiles")
        generate_tiles(data_path, True)

        log_info("Completing pipeline")
        file = "first_run.txt"
        cmd = f"touch {data_path}/{file}"
        call(cmd, shell=True)

    log_goodbye()


@cli.command(
    help="Print data sources for all ETL processes (or a specific one)",
)
@dataset_option
def print_data_sources(dataset: str):
    """Print data sources for all ETL processes (or a specific one)

    Args:
        dataset (str): Name of the ETL module to be run (optional)

    Returns:
        None
    """
    log_title("Print ETL Datasources")

    log_info("Retrieving dataset(s)")
    sources = get_data_sources(dataset)

    log_info(f"Discovered {len(sources)} files")

    for s in sources:
        log_info(s)

    log_goodbye()


@cli.command(
    help="Fetch data sources for all ETL processes (or a specific one)",
)
@dataset_option
@use_cache_option
def extract_data_sources(dataset: str, use_cache: bool):
    """Extract and cache data source(s) for all ETL processes (or a specific one)

    Args:
        dataset (str): Name of the ETL module whose data sources you wish to fetch
        use_cache (bool): Use this flag if you wish to use the cached data sources (if they exist)

    Returns:
        None
    """
    log_title("Fetch ETL Datasources")

    log_info("Fetching data source(s)")
    extract_ds(dataset, use_cache)

    log_goodbye()


@cli.command(
    help="Clear data source cache for all ETL processes (or a specific one)",
)
@dataset_option
def clear_data_source_cache(dataset: str):
    """Clear data source(s) cache for all ETL processes (or a specific one)

    Args:
        dataset (str): Name of the ETL module whose cache you wish to clear

    Returns:
        None
    """
    log_title("Fetch ETL Datasources")

    log_info("Clear data source cache")
    clear_ds_cache(dataset)

    log_goodbye()


@cli.command(
    help="Generate scoring and tiles",
)
@click.pass_context
def full_post_etl(ctx):
    """Generate scoring and tiles including tribal layer"""
    ctx.invoke(score_run)
    ctx.invoke(generate_score_post, data_source=None)
    ctx.invoke(geo_score, data_source=None)
    ctx.invoke(generate_map_tiles, generate_tribal_layer=False)
    ctx.invoke(generate_map_tiles, generate_tribal_layer=True)


@cli.command(
    help="Run all downloads, extracts, and generate scores and tiles",
)
@use_cache_option
@click.pass_context
def full_run(ctx, use_cache):
    """Run all downloads, ETLs, and generate scores and tiles including tribal layer"""
    if not use_cache:
        ctx.invoke(data_cleanup)
    ctx.invoke(census_data_download, zip_compress=False, use_cache=use_cache)
    ctx.invoke(etl_run, dataset=None, use_cache=use_cache)
    ctx.invoke(full_post_etl)


@cli.command(
    help="Convert a Pickle or Parquet file to GeoJSON or CSV depending on the contents of the file.",
)
@click.option(
    "--source",
    "-s",
    type=click.Path(),
    # We don't require this option, otherwise the tool will not run when there is no score
    default=constants.DATA_SCORE_CSV_FULL_FILE_PATH,
    help="Path to the input file. Defaults to the default location of the local score file.",
)
@click.option(
    "--destination",
    "-d",
    type=click.Path(writable=True),
    default=Path(
        os.path.splitext(constants.DATA_SCORE_CSV_FULL_FILE_PATH)[0] + ".csv"
    ),
    help="Path to the input file. Defaults to the source file with CSV extension.",
)
def convert_score(source: Path, destination: Path):
    """Converts the score file to CSV."""
    if source.exists():
        score_df = pd.read_parquet(source)
        logger.info(f"Saving score as CSV to {destination}")
        score_df.to_csv(destination, index=False)
        logger.info("Done.")
    else:
        logger.error(f"Error: Unable to read {source}")
        sys.exit(1)


def log_title(title: str, subtitle: str = None):
    """Logs a title in our fancy title format"""
    logger.info("-" * LOG_LINE_WIDTH)
    logger.info("")
    logger.info(f"{title}")
    if subtitle:
        logger.info(f"{subtitle}")
    logger.info("")
    logger.info("-" * LOG_LINE_WIDTH)
    logger.info("")


def log_info(info: str):
    """Logs a general informational message"""
    logger.info(f"- {info}")


def log_goodbye():
    """Logs a goodbye message"""
    logger.info("- Finished. Bye!")


if __name__ == "__main__":
    cli()
