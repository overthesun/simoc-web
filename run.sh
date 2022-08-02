echo '* Running <run.sh>...'
echo '* Current working directory is:' `pwd`

if [ ! -e node_modules ]; then
    echo '* No node_modules/ dir found, installing dependencies...'
    npm install
    echo '* Dependencies installed'
fi

echo '* Updating/downloading simdata/models/skybox files...'
cd src/assets
wget -c -r -erobots=off -q -nH --cut-dirs=1 --no-parent\
    --accept="*.json,*.glb,*.jpg" \
    https://simoc.space/download/simdata/ \
    https://simoc.space/download/models/ \
    https://simoc.space/download/skybox/
echo '* Simdata/models/skybox files downloaded to <src/assets>'
cd ../..

echo '* To start the dev server use: npm run dev'
/bin/bash
