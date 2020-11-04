const _ = require("lodash");
const fs = require('fs');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
require('colors');
exports.status = function () {
    loopProjects(function(folder) {
        return new Promise(async resolve => {
            const {stdout} = await exec(`cd ${folder} && git status --porcelain=v2`);
            const editedFiles = _.filter(stdout.split('\n')).map(i => _.last(i.split(" ")));
            if (editedFiles.length === 0)
                console.log("✔ No files have been updated.");
            else
                console.log(("❌ Some files have been edited: " + editedFiles.join(", ")));
            resolve();
        })
    })
};
exports.commit = function(commit) {
    loopProjects(function(folder) {
        return new Promise(async resolve => {
            let stdout;
            try {
                stdout = (await exec(`cd ${folder} && git add . && git commit -m "${typeof commit === "string" ? commit : "Update"}" && git push`)).stdout;
            } catch (e) {
                stdout = e.stdout;
            }
            console.log(stdout);
            resolve();
        })
    })
};
exports.pull = function() {
    loopProjects(function(folder) {
        return new Promise(async resolve => {
            let stdout;
            try {
                stdout = (await exec(`cd ${folder} && git pull`)).stdout;
            } catch (e) {
                stdout = e.stdout;
            }
            console.log(stdout);
            resolve();
        })
    })
};
async function loopProjects(callback) {
    const path = process.cwd();
    const allFolder = fs.readdirSync(path);
    const readline = require('readline');
    const blank = '\n'.repeat(process.stdout.rows);
    console.log(blank);
    readline.cursorTo(process.stdout, 0, 0);
    readline.clearScreenDown(process.stdout);
    console.log("*******************************************");
    console.log("**  CHECKING BULLSEYE REPO GIT STATUSES  **");
    console.log("*******************************************");
    console.log();
    for (let i = 0; i < allFolder.length; i++) {
        const folderPath = path + "/" + allFolder[i];
        if (!fs.lstatSync(folderPath).isDirectory() || folderPath + "/" + "lib" === __dirname)
            continue;
        if (!fs.existsSync(folderPath + "/" + ".git")) {
            continue;
        }
        console.log(`Checking project ${allFolder[i]}`.underline.bold);
        await callback(folderPath);
        console.log();
    }
}