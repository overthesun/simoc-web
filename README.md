# SIMOC Web

This is the web frontend for [SIMOC](https://github.com/overthesun/simoc).

![SIMOC Dashboard](https://simoc.space/wp-content/uploads/2020/09/simoc_b2_dashboard.jpg)

## Project setup

### Building the frontend for SIMOC
In order to use this frontend with SIMOC, you need to 
[set up SIMOC and SIMOC Web on your machine](https://simoc.readthedocs.io/en/latest/developer/setup.html).

This will build the frontend in the `dist` directory and copy it in the backend.

### Develop the frontend
If you want to make changes to the frontend:

1. Set up SIMOC and SIMOC Web as described above
2. `cd` in the `simoc-web` dir and run `python3 simoc-web.py shell`
3. In the shell, run `npm run dev` and open the browser at the given address

This will run a developer version of the frontend in a Docker container.
You can now edit the source and see your changes live.
