## SELENIUM WEB TESTING
To run with default parameters go to your terminal and enter: `python3 selenium_test.py`

There are currently 3 supported args --browser(-b), --processes(-p), --days(-d) i.e. `python3 selenium_test.py -p 3 -d 30`

This will run 3 browser windows and run a custom sim based off the SAM preset for 30 days

Currently only Chrome is properly working but adding browser support for other browser should be easy within this script.

Also can only currently be run on Python 3.10+ due to using the new `match` syntax but can easily be modified to run on versions pre 3.10
