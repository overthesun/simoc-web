# SIMOC Web

This is the web frontend for [SIMOC](https://github.com/overthesun/simoc).

## Project setup

### Run SIMOC locally
If you want to run SIMOC locally:

1. Clone the [SIMOC](https://github.com/overthesun/simoc) repository
2. Clone this repository
3. `cd` in the `simoc-web` dir and run `python3 simoc-web.py setup`
4. `cd` in the `simoc` dir and run `python3 simoc.py setup`

This will build the frontend, copy it in the backend repo, and open
SIMOC in the browser.

### Develop the frontend

If you want to make changes to the frontend:

1. Run the steps listed above
2. `cd` in the `simoc-web` dir and run `python3 simoc-web.py shell`
3. In the shell, run `npm run dev` and open the browser at the given address

This will run a developer version of the frontend in a Docker container.
You can now edit the source and see your changes live.

**Note**: this project is tested on Linux and requires `docker`, `docker-compose`,
and `Jinja` to setup, build, and run the Docker containers.
If you are on Debian/Ubuntu, the `simoc.py` script will take care of
installing these dependencies automatically.
