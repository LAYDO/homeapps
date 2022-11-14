# homeapps
Series of applications that I run on a home raspberrypi server

## r/place data
The data to run the r/place application can be manually downloaded in CSV format from here:

[r/place Datasets April Fool's 2022](https://www.reddit/r/place/comments/txvk2d/rplace_datasets_april_fools_2022/)

After downloading the zipped file, transfer to the `/homeapps/data/` directory, and run the `load_csv.py` file with python3 in the virtual environment.

A script could look similar to below:

```
$ cd ~/homeapps/data
$ sudo wget -O https://placedata.reddit.com/data/canvas-history/2022_place_canvas_history.csv.gzip | gunzip
$ source venv/bin/activate
$ python3 load_csv.py
```

### TODOs:
- [ X ] Update README to reflect data download procedure
- [   ] Script to download and load data