#! /usr/bin/env node
const { spawn, exec } = require('child_process')
const path = require('path')
const fs = require('fs')

const yesno = require('yesno')

const isWin = process.platform === "win32";
const repo = 'https://github.com/toniop99/quickly-express-api.git'

// TODO: Check dirName
const name = process.argv[2];
if( !name ) {
    console.error(`
        Invalid directory name.
        Usage: npx quickly-create-express-api app-name
    `)
    return 0;
}

if(checkFolderExists(name)) {
    console.log('Ya existe una carpeta con ese nombre.')
    yesno({
        question: '¿Quieres borrar la carpeta existente?',
    }).then(response => {
        if(!response) {
            console.log('Okey! Vuelve a intentarlo con otro nombre.')
            return 0;
        } else {
            fs.rmSync(name, {recursive: true, force: true});
            console.log('Carpeta borrada. Procediendo a la instalación...')
            executeCommand('git', ['clone', repo, name]).then(async () => {
                console.info('Installing npm dependencies...')
            
                isWin ? 
                    await executeCommandWin('npm install', { cwd: path.join(process.cwd(), '/', name) })
                    :
                    await executeCommand('npm', ['install'], { cwd: path.join(process.cwd(), '/', name) })
            
                console.log('Finished!');
                console.log('To start: ');
                console.log('cd', name);
                console.log('npm run start:dev');
            
                return 0
            })
        }
    })
}

function executeCommand(command, args, options = undefined) {
    const spawnT = spawn(command, args, options)

    return new Promise((resolve, _) => {
        spawnT.stdout.on('data', (data) => {
            console.info(data.toString())
        })

        spawnT.stderr.on('data', (data) => {
            console.error(data.toString())
        })

        spawnT.on('close', () => {
            resolve()
        })
    })
}


function executeCommandWin(command, options = undefined) {
    const spawnT = exec(command, options)

    return new Promise((resolve, _) => {
        spawnT.stdout.on('data', (data) => {
            console.info(data.toString())
        })

        spawnT.stderr.on('data', (data) => {
            console.error(data.toString())
        })

        spawnT.on('close', () => {
            resolve()
        })
    })
}

function checkFolderExists(folderPath) {
    const folderExists = fs.existsSync(folderPath)
    return folderExists
}