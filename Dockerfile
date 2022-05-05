FROM ubuntu:22.04

MAINTAINER Ezio Melotti "ezio.melotti@gmail.com"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3-pip \
    python3-setuptools \
    curl \
    wget \
    inetutils-ping \
    npm

WORKDIR /frontend

# COPY . ./
# RUN npm install --global

EXPOSE 8080

ENTRYPOINT [ "/bin/bash" ]
CMD ["run.sh"]


# By default nothing is installed during build, because by sharing the dir,
# everything installed in /frontend inside of the container gets overriden.
# Instead, the run.sh scripts checks if the node_modules/ dir is present, and
# runs `npm install` automatically the first time the container is run if not.
# Since the frontend/ dir is shared with the host, node_modules/ will persist
# on the host and it won't be necessary to install the modules again the next
# time the container is started.
# The same happens for the cached simdata files -- if the simdata dir is
# missing, run.sh will create it and download the files.


# Build the container (once) using:
#   docker build . -t frontend-dev
#
# Run the container using:
#   docker run --rm --network simoc_simoc-net -p 8080:8080 -v `pwd`:/frontend -it frontend-dev


# To automatically run the frontend the dockerfile can be changed to:
#   ENTRYPOINT ["npm", "run"]
#   CMD ["serve"]
# This will automatically run `npm run serve` when the container is run with this command:
#   docker run --rm --network simoc_simoc-net -p 8080:8080 -v `pwd`:/frontend frontend-dev
# From there it's also possible to start the container running `npm run build` by doing:
#   docker run --rm --network simoc_simoc-net -p 8080:8080 -v `pwd`:/frontend frontend-dev build
# And to get shell access to the container it's possible to run:
#   docker run --rm --network simoc_simoc-net -p 8080:8080 -v `pwd`:/frontend -it --entrypoint /bin/bash frontend-dev
#
# This however has some issues, so by default with run `run.sh` and drop
# you in a shell where you can start and restart things manually.
#
# If you set this up to run `npm run serve` automatically you might not be able
# to stop it with ctrl+c.  If you kill it, it might keep the port in use.
# To free the port you can list containers with `docker container ls` and
# remove it manually with `docker rm <container-id>`.
