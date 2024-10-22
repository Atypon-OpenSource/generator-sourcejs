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
        this.log(yosay('Creating new SourceJS Middleware!'));

        const prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter short Middleware name (sourcejs-<name>):',
                default: 'middleware'
            },
            {
                type: 'input',
                name: 'title',
                message: 'Enter human readable Middleware title:',
                default: 'My new Middleware'
            },
            {
                type: 'input',
                name: 'description',
                message: 'Enter Middleware description:',
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

        this.fs.copyTpl(
            this.templatePath('_README.md'),
            this.destinationPath(path.join(folderName, 'README.md')),
            { name: this.name, title: this.title, description: this.description, author: this.author }
        );

        this.fs.copyTpl(
            this.templatePath('_package.json'),
            this.destinationPath(path.join(folderName, 'package.json')),
            { name: this.name, title: this.title, description: this.description, author: this.author }
        );

        this.fs.copy(
            this.templatePath('core'),
            this.destinationPath(path.join(folderName, 'core'))
        );
    }
};
