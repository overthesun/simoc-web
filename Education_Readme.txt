This Readme assumes you have already built and are running the Simoc (Backend) docker containers
and you are running sioserver from simoc-sam (SAM) as well as the sensors. See the readme's in those
directories first.

Once SAM and BACK are running, to run WEB:

1. First open the terminal in this window by right clicking on WEB and "Open in New Terminal"
2. Type in the command 
simoc-web.py shell
3. When the shell starts (it will say something like FrontEnd#) type in:
npm run serve
4. If it is succesful the screen will show:
 App running at:
  - Local:   http://localhost:8080/ 

5. Then open the web browser and choose SIMOC from the bookmarks bar (or type localhost:8080 into the browser)
SIMOC should load in.

If not, it needs to be built. In that case press ctrl+C a few times and then when it comes back to FrontEnd# 
type "exit" and press enter.

If it needs to be built:
1. Enter the command below:
python3 simoc-web.py build-image
2. When it finishes run the command below:
python3 simoc-web.py shell
3. When the shell starts (it will say something like FrontEnd#) errors will probably appear on the screen. 
Ignore them. Copy and paste the following into the terminal:

npm uninstall node-sass && \
npm install sass &&  \
rm -rf node_modules/node-sass/ && \
mv node_modules/sass node_modules/node-sass; 

4. Enter "npm run serve". Then open the web browser and choose SIMOC (or type localhost:8080 into the browser)
SIMOC should load in.

5. Then open the web browser and choose SIMOC from the bookmarks bar (or type localhost:8080 into the browser)
SIMOC should load in.