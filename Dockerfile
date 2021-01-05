FROM ubuntu:20.04

MAINTAINER Ezio Melotti "ezio.melotti@gmail.com"

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    python3-pip \
    python3-setuptools \
    curl \
    inetutils-ping \
    npm

WORKDIR /frontend

# COPY . ./
# RUN npm install --global

EXPOSE 8080

ENTRYPOINT [ "/bin/bash" ]
CMD ["run.sh"]


# This container can be build and launched by the simoc.py script in the
# main simoc repo by specifying the --with-dev-frontend option.

# To build and run manually, use:
# docker build . -t frontend-dev
# docker run --rm --network simoc_simoc-net -p 8080:8080 -v `pwd`:/frontend frontend-dev

# By default nothing is installed during build, because by sharing the dir,
# everything installed in /frontend inside of the container gets overriden.
# Instead, the run.sh scripts checks if the node_modules/ dir is present, and
# runs `npm install` automatically the first time the container is run if not.
# Since the frontend/ dir is shared with the host, node_modules/ will persist
# on the host and it won't be necessary to install the modules again the next
# time the container is started.


# Note: if you run the container using `docker run` you might not be able
# to stop it with ctrl+c.  If you kill it, it might keep the port in use.
# To free the port you can list containers with `docker container ls` and
# remove it manually with `docker rm <container-id>`.



# Obsolete instructions kept for reference follow.
#
# run `npm run serve` by default
# ENTRYPOINT ["npm", "run"]
# CMD ["serve"]
# start the container running `npm run serve`:
# docker run --rm --network simoc_simoc-net -p 8080:8080 -v `pwd`:/frontend frontend-dev
# start the container running `npm run build`:
# docker run --rm --network simoc_simoc-net -p 8080:8080 -v `pwd`:/frontend frontend-dev build
# start the container with an interactive shell:
# docker run --rm --network simoc_simoc-net -p 8080:8080 -v `pwd`:/frontend -it --entrypoint /bin/bash frontend-dev
