"""Script to setup and run the SIMOC frontend through Docker."""

import os
import shutil
import pathlib
import argparse
import subprocess

IMGNAME = 'frontend-dev'
SIMOC_WEB_DIR = pathlib.Path(__file__).resolve().parent
# both dirs *should* have the same parent dir
SIMOC_DIR = SIMOC_WEB_DIR.parent / 'simoc'

COMMANDS = {}

def cmd(func):
    """Decorator to add commands to the COMMANDS dict."""
    COMMANDS[func.__name__] = func
    return func

def run(args):
    print('>'*80)
    print(' '.join(args))
    print('-'*80)
    result = subprocess.run(args)
    print('-'*80)
    print(result)
    print('<'*80)
    print()
    return not result.returncode

def docker_available():
    """Return True if docker is installed."""
    return shutil.which('docker')

def docker_run(*args):
    """Run an arbitrary docker command."""
    if not docker_available():
        install_docker()
    # detect and connect to the network if it's available
    net_name = 'simoc_simoc-net'
    cp = subprocess.run(['docker', 'network', 'inspect', net_name],
                        stdout=subprocess.DEVNULL)
    net_args = ['--network', net_name] if cp.returncode == 0 else []
    fe_branch = f'VITE_FE_BRANCH={get_current_branch(SIMOC_WEB_DIR)}'
    be_branch = f'VITE_BE_BRANCH={get_current_branch(SIMOC_DIR)}'
    return run(['docker', 'run', '--rm', *net_args, '-p', '8080:8080',
                '-e', fe_branch, '-e', be_branch,
                '-v', f'{SIMOC_WEB_DIR}:/frontend', *args])

def install_docker():
    """Install docker and docker-compose."""
    # technically we don't need docker-compose, but we might as well
    # install it, since it's needed by the backend
    return install_docker_linux()

def install_docker_linux():
    # this function is duplicated in overthesun/simoc/simoc.py,
    # changes to this function should be ported there too
    if docker_available():
        return True
    # `apt` already creates a `docker` group, but we need to manually
    # add the current user to it and ask the user to log out/log in
    # for the change to take place and for `docker` to work without `sudo`
    print('Installing docker and docker-compose:')
    user = os.getenv('USER')
    if not (run(['sudo', 'apt', 'install', '-y', 'docker', 'docker-compose']) and
            run(['sudo', 'usermod', '-aG', 'docker', user])):
        return False
    print('Please log out and log in again (or restart the machine) '
          'to complete the Docker installation.')
    print('After logging back in, you can resume the installation of SIMOC.')
    print()
    return False

def get_current_branch(dir):
    branch_cmd = ['git', 'branch', '--show-current']
    try:
        branch = subprocess.check_output(branch_cmd, cwd=dir).decode().strip()
        return branch or '[unknown]'
    except (FileNotFoundError, subprocess.CalledProcessError) as e:
        print(e)
        return '[error]'

@cmd
def build_image():
    """Build the frontend-dev image locally."""
    return run(['docker', 'build', '.', '-t', IMGNAME])

@cmd
def setup_deps():
    """Install frontend dependencies and download files."""
    return docker_run('--entrypoint', 'bash', IMGNAME, 'run.sh')

@cmd
def shell():
    """Run an interactive shell in the frontend-dev container."""
    return docker_run('-it', IMGNAME)

@cmd
def serve():
    """Serve the frontend using `npm run serve`."""
    return docker_run('-it', '--entrypoint', 'npm', IMGNAME, 'run', 'serve')

@cmd
def build():
    """Build the frontend using `npm run build`."""
    return docker_run('-it', '--entrypoint', 'npm', IMGNAME, 'run', 'build')

@cmd
def copy_dist_dir(assume_yes=False):
    """Copy the dist dir into the "simoc" repo."""
    # assume that both the simoc and simoc-web repos are in the same dir
    simoc_server_dir = SIMOC_DIR / 'simoc_server'
    simoc_web_dist_dir = SIMOC_WEB_DIR / 'dist'
    if not simoc_server_dir.exists():
        print(f'* <{simoc_server_dir}> does not exist')
        if not assume_yes:
            return False
        p = input('* Please enter the path to the "simoc_server" dir: ')
        simoc_server_dir = pathlib.Path(p).resolve()
    ans = 'y'
    if not assume_yes:
        ans = input(f'* Copy <{simoc_web_dist_dir}> into <{simoc_server_dir}>? [Y/n] ')
    if ans.lower().strip() == 'n':
        print(f'* <{simoc_web_dist_dir}> not copied')
        return False
    simoc_dist_dir = simoc_server_dir / 'dist'
    if simoc_dist_dir.exists():
        ans = 'y'
        if not assume_yes:
            ans = input(f'* <{simoc_dist_dir}> already exist, remove it? [Y/n] ')
        if ans.lower().strip() == 'n':
            print(f'* <{simoc_web_dist_dir}> not copied')
            return False
        shutil.rmtree(simoc_dist_dir)
        print(f'* <{simoc_dist_dir}> removed.')
    shutil.copytree(simoc_web_dist_dir, simoc_dist_dir)
    print(f'* Copied <{simoc_web_dist_dir}> into <{simoc_server_dir}> ')
    return True

@cmd
def build_and_copy():
    """Build the frontend and copy the dist dir in the simoc repo."""
    return build() and copy_dist_dir()

@cmd
def setup():
    """Set up the docker image, build the frontend, and copy the dist dir."""
    return (install_docker() and build_image() and setup_deps() and
            build_and_copy())

@cmd
def deploy():
    """Build the SIMOC frontend and copy it for deployment."""
    return (build_image() and setup_deps() and build() and
            copy_dist_dir(assume_yes=True))


def create_help(cmds):
    help = ['Full list of available commands:']
    for cmd, func in cmds.items():
        help.append(f'{cmd.replace("_", "-"):18} {func.__doc__}')
    return '\n'.join(help)


if __name__ == '__main__':
    desc = "Setup and run the SIMOC frontend development container."
    parser = argparse.ArgumentParser(
        description=desc,
        formatter_class=argparse.RawTextHelpFormatter
    )
    parser.add_argument('cmd', metavar='CMD', help=create_help(COMMANDS))
    parser.add_argument('args', metavar='*ARGS', nargs='*',
                        help='Additional optional args to be passed to CMD.')
    args = parser.parse_args()

    cmd = args.cmd.replace('-', '_')
    if cmd in COMMANDS:
        result = COMMANDS[cmd](*args.args)
        parser.exit(not result)
    else:
        cmds = ', '.join(cmd.replace('_', '-') for cmd in COMMANDS.keys())
        parser.error(f'Command not found.  Available commands: {cmds}')
