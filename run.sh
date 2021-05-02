echo '* Running <run.sh>...'
echo '* Current working directory is:' `pwd`

if [ ! -e node_modules ]; then
    echo '* No node_modules/ dir found, installing dependencies...'
    npm install
    echo '* Dependencies installed'
fi

if [ ! -e src/assets/simdata ]; then
    echo '* No simdata dir found, downloading presets simdata...'
    cd src/assets
    mkdir simdata
    cd simdata
    wget -r -nH --cut-dirs=2 --no-parent --accept="*.json" -erobots=off -q --show-progress https://simoc.space/download/simdata/
    echo '* Simulation data downloaded to src/assets/simdata'
    cd ../../..
fi


echo '* Opening shell, to start the dev server use: npm run serve'
/bin/bash
