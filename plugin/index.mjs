import Generator from 'yeoman-generator';
import yosay from 'yosay';
import path from 'path';
import { fileURLToPath } from 'url';

// For compatibility with ES modules, get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class extends Generator {
    async prompting() {
        // Have Yeoman greet the user.
        this.log(yosay('Creating new SourceJS Plugin!'));

        const prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter short Plugin name (sourcejs-<name>):',
                default: 'plugin'
            },
            {
                type: 'input',
                name: 'title',
                message: 'Enter human readable Plugin title:',
                default: 'My new plugin'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Enter Plugin description:',
                default: 'Adds new features to SourceJS.'
            }
        ];

        const props = await this.prompt(prompts);

        this.name = props.name;
        this.title = props.title;
        this.description = props.description;
        this.author = this.user.git.name() || 'unknown';
    }

    writing() {
        const folderName = `sourcejs-${this.name}`;

        // Copy README template
        this.fs.copyTpl(
            this.templatePath('_README.md'),
            this.destinationPath(path.join(folderName, 'README.md')),
            {
                name: this.name,
                title: this.title,
                description: this.description,
                author: this.author
            }
        );

        // Copy package.json template
        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath(path.join(folderName, 'package.json')),
            {
                name: this.name,
                title: this.title,
                description: this.description,
                author: this.author
            }
        );

        // Copy assets JavaScript and CSS files
        this.fs.copyTpl(
            this.templatePath('assets/_index.js'),
            this.destinationPath(path.join(folderName, 'assets/index.js')),
            { name: this.name }
        );
        this.fs.copyTpl(
            this.templatePath('assets/css/_main.css'),
            this.destinationPath(path.join(folderName, `assets/css/${this.name}.css`)),
            { name: this.name }
        );

        // Copy README for assets
        this.fs.copy(
            this.templatePath('assets/README.md'),
            this.destinationPath(path.join(folderName, 'assets/README.md'))
        );

        // Copy the core directory
        this.fs.copy(
            this.templatePath('core'),
            this.destinationPath(path.join(folderName, 'core'))
        );
    }
}
