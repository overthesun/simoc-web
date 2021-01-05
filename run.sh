echo '* Running <run.sh>...'
echo '* Current working directory is:' `pwd`
if [ ! -e node_modules ]; then
    echo '* No node_modules/ dir found, installing dependencies...'
    npm install
fi

echo '* Dependencies installed, starting the dev server...'
npm run serve
