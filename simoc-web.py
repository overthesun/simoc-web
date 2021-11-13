"""Script to setup and run the SIMOC frontend through Docker."""

import shutil
import pathlib
import argparse
import subprocess

IMGNAME = 'frontend-dev'
SIMOC_WEB_DIR = pathlib.Path(__file__).resolve().parent

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

def docker_run(*args):
    """Run an arbitrary docker-compose command."""
    return run(['docker', 'run', '--rm', '--network', 'simoc_simoc-net',
                '-p', '8080:8080', '-v', f'{SIMOC_WEB_DIR}:/frontend', *args])


@cmd
def build_image():
    """Build the frontend-dev image locally."""
    return run(['docker', 'build', '.', '-t', IMGNAME])

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
def copy_dist_dir():
    """Copy the dist dir into the "simoc" repo."""
    # assume that both the simoc and simoc-web repos are in the same dir
    simoc_server_dir = SIMOC_WEB_DIR.parent / 'simoc' / 'simoc_server'
    simoc_web_dist_dir = SIMOC_WEB_DIR / 'dist'
    if not simoc_server_dir.exists():
        print(f'* <{simoc_server_dir}> does not exist')
        p = input('* Please enter the path to the "simoc_server" dir: ')
        simoc_server_dir = pathlib.Path(p).resolve()
    ans = input(f'* Copy <{simoc_web_dist_dir}> into <{simoc_server_dir}>? [Y/n] ')
    if ans.lower().strip() == 'n':
        print('* Aborting')
        return False
    simoc_dist_dir = simoc_server_dir / 'dist'
    if simoc_dist_dir.exists():
        ans = input(f'* <{simoc_dist_dir}> already exist, remove it? [Y/n] ')
        if ans.lower().strip() == 'n':
            print('* Aborting')
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