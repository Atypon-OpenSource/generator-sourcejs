
import { rimraf, rimrafSync, native, nativeSync } from 'rimraf';
import Generator from 'yeoman-generator';
import yosay from 'yosay';
import path from 'path';
import { fileURLToPath } from 'url';
import pgk from '../package.json' assert { type: 'json' };

// For compatibility with ES modules, get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const conf = {
    repoUser: 'sourcejs',
    repo: 'Source',
    branch: 'master',
    initRepo: 'init',
    initBranch: 'master'
};

export default class extends Generator {
    constructor(args, opts) {
        super(args, opts);
        this.option('repo', { type: String });
        this.option('branch', { type: String });
        this.option('repo-user', { type: String });

        this.option('init-repo', { type: String });
        this.option('init-branch', { type: String });
        this.pkg = pgk;
        this.cleanName = this.pkg.name.replace('generator-', '');
        this.currentAction = args[0];
    }

    initializing() {
        // Have Yeoman greet the user.
        this.log(yosay('Welcome to the SourceJS generator!'));
    }

    prompting() {
        this.noOptions = !(
            this.options.repo ||
            this.options.branch ||
            this.options['repo-user'] ||
            this.options['init-repo'] ||
            this.options['init-branch']
        );

        if (this.args.length === 0 && this.noOptions) {
            return this.prompt([
                {
                    type: 'list',
                    name: 'actionsList',
                    message: 'Which action would you like to perform?',
                    choices: [
                        { name: 'Init SourceJS in this folder', value: 'init' },
                        { name: 'Create Spec in new folder', value: 'spec' },
                        { name: 'Create SourceJS Plugin in new folder', value: 'plugin' },
                        { name: 'Create SourceJS Middleware in new folder', value: 'middleware' }
                    ]
                }
            ]).then((answers) => {
                this.currentAction = answers.actionsList;
            });
        } else {
            this.currentAction = this.currentAction || 'init';
        }
    }

    _getSource(cb) {
        const repo = this.options.repo || conf.repo;
        const branch = this.options.branch || conf.branch;
        const user = this.options['repo-user'] || conf.repoUser;

        const url = `https://github.com/${user}/${repo}`;

        this.log(`Cloning SourceJS from ${url} at branch ${branch}`);
        this.spawnCommandSync('git', ['clone', '-b', branch, url, '.']);
        this._getSourceInit(cb);
    }

    _getSourceInit(cb) {
        const repo = this.options['init-repo'] || conf.initRepo;
        const branch = this.options['init-branch'] || conf.initBranch;
        const user = this.options['repo-user'] || conf.repoUser;
    
        const url = `https://github.com/${user}/${repo}`;
        this.log(`Cloning SourceJS init from ${url} at branch ${branch}`);
    
        // Clone the init repo into the 'user' directory
        this.spawnCommandSync('git', ['clone', '-b', branch, url, 'user']);
    
        if (typeof cb === 'function') cb();
    }

    async writing() {
        if (this.currentAction === 'init') {
            await new Promise((resolve, reject) => {
                this._getSource(() => {
                    this.depsNeeded = true;
                    resolve();
                });
            })
        }
    }

    install() {
        if (this.depsNeeded) {
            this.installDeps()
            this.spawnCommandSync('cp', ['-R', 'docs/starting', 'user/specs/starting']);

            if (this.runSource) {
                this._serve();
            }
        }
    }

    installDeps() {
        // Manually run npm install using spawnCommand
        this.spawnCommand('npm', ['install']);
    }
    _serve() {
        this.spawnCommand('node', ['app']);
    }

    end() {
        if (this.currentAction === 'spec') {
            this.spawnCommandSync('yo', ['sourcejs:spec']);
        } else if (this.currentAction === 'plugin') {
            this.spawnCommandSync('yo', ['sourcejs:plugin']);
        } else if (this.currentAction === 'middleware') {
            this.spawnCommandSync('yo', ['sourcejs:middleware']);
        }
    }
};
