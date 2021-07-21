echo '* Running <run.sh>...'
echo '* Current working directory is:' `pwd`

if [ ! -e node_modules ]; then
    echo '* No node_modules/ dir found, installing dependencies...'
    npm install
    echo '* Dependencies installed'
fi

if [ ! -e src/assets/simdata ]; then
    echo '* No simdata dir found, creating <src/assets/simdata> dir...'
    cd src/assets
    mkdir simdata
    cd ../..
    echo '* <src/assets/simdata> dir created'
fi

echo '* Updating/downloading presets simdata...'
cd src/assets/simdata
wget -c -r -nH --cut-dirs=2 --no-parent --accept="*.json" -erobots=off -q https://simoc.space/download/simdata/
echo '* Presets simdata downloaded to <src/assets/simdata>'
cd ../../..


echo '* To start the dev server use: npm run serve'
/bin/bash
