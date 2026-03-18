echo '* Running <run.sh>...'
echo "* Current working directory: $(pwd)"
echo "* Current node/npm versions: node $(node --version); npm $(npm --version)"
echo "* Current fe/be branches: $VITE_FE_BRANCH; $VITE_BE_BRANCH"

if [ ! -e node_modules ]; then
    echo '* No node_modules/ dir found, installing dependencies...'
    npm install --no-fund
    echo '* Dependencies installed'
fi

echo '* Updating/downloading simdata/models/skybox files...'
cd public
wget -r -q --timestamping -erobots=off -nH --cut-dirs=1 --no-parent \
    --accept="*.gz" \
    https://simoc.space/download/simdata/
echo '* Simdata files downloaded/updated in <public/simdata>'
cd ..
cd src/assets
wget -r -q --timestamping -erobots=off -nH --cut-dirs=1 --no-parent \
    --accept="*.glb,*.jpg" \
    https://simoc.space/download/models/ \
    https://simoc.space/download/skybox/
echo '* Models and skybox files downloaded/updated in <src/assets>'
cd ../..

echo '* To start the dev server use: npm run dev'
/bin/bash
