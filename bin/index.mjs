#!/usr/bin/env node
import {$, chalk, question, cd} from 'zx'
import fs from 'fs'
import path from 'path'

$.verbose = false

const repo = 'https://github.com/toniop99/quickly-express-api.git'
let dirName = process.argv[2];

if( !dirName ) {
    console.log(chalk.redBright('No directory name for project set.'))

    do {
        dirName = await question(chalk.yellow('Write a name for the project directory: '))
    } while(dirName === '')
}

if(!dirName.match(/^[a-zA-Z0-9\-\_]+$/)) {
    console.log(chalk.redBright('Invalid diriectory name'))
    throw new Error('Invalid folder name')
}

if(checkFolderExists(path.join(process.cwd(), dirName))) {
    console.log(chalk.redBright(`A folder with this name already exists in the current path...`))
    const response = await question('¿Do you want to delete the current folder? (Y,N): ', {choices: ['Y', 'N']})
    
    if(response.toLowerCase() === 'n') {
        console.log('Okey! Try with another name!')
        throw new Error('Name already in use')
    } else {
        console.log(chalk.yellow('Deleting folder...'));
        fs.rmSync(path.join(process.cwd(), dirName), {recursive: true, force: true})
        console.log(chalk.yellow('Folder deleted. Continuing with the installation.'))
    }
}

await $`git clone ${repo} ${dirName}`
fs.rmSync(path.join(process.cwd(), dirName, '.git'), {recursive: true, force: true});
cd(path.join(process.cwd(), dirName))
console.log(chalk.yellow('Installing dependencies...'))
await $`npm install`
console.log(chalk.yellow(`Copying ${chalk.bold.yellow('.env.sample')} into ${chalk.bold.yellow('.env')}`))
fs.copyFileSync(path.join(process.cwd(), dirName, '.env.sample'), path.join(process.cwd(), dirName, '.env'))

console.log()
console.log(chalk.magenta('Finished!'));
console.log(chalk.magenta('To start developing: '));
console.log(chalk.yellow('cd'), dirName);
console.log(chalk.yellow('npm run'), 'start:dev');


function checkFolderExists(folderPath) {
    return fs.existsSync(folderPath)
}