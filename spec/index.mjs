import Generator from 'yeoman-generator';
import yosay from 'yosay';
import path from 'path';
import { fileURLToPath } from 'url';
import pgk from '../package.json' assert { type: 'json' };

// For compatibility with ES modules, get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default class extends Generator {
    initializing() {
        this.pkg = pgk;
    }

    async prompting() {
        // Have Yeoman greet the user.
        this.log(yosay('Creating new SourceJS spec!'));

        const prompts = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter short Spec name (folder name):',
                default: 'new-spec'
            },
            {
                type: 'input',
                name: 'title',
                message: 'Enter human readable Spec title:',
                default: 'New Spec title'
            },
            {
                type: 'input',
                name: 'keywords',
                message: 'Enter spec keywords (comma separated)',
                default: 'none'
            }
        ];

        const props = await this.prompt(prompts);

        this.name = props.name;
        this.title = props.title;
        this.author = this.user.git.name() || 'unknown';
        this.keywords = props.keywords === 'none' ? undefined : props.keywords;
    }

    writing() {
        // Copy and process the templates for the spec files
        this.fs.copyTpl(
            this.templatePath('_index.src.html'),
            this.destinationPath(path.join(this.name, 'index.src.html')),
            { title: this.title, author: this.author }
        );

        this.fs.copyTpl(
            this.templatePath('_info.json'),
            this.destinationPath(path.join(this.name, 'info.json')),
            { title: this.title, author: this.author, keywords: this.keywords }
        );
    }
}
