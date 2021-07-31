#!/usr/bin/env node

//tried to create a user input to install but that didn't work

const fs = require("fs");
const readline = require('readline')

console.log('Going to check for modules installed');

var moduleList = ['express', 'nodemon', 'ejs']

for (let i = 0; i < moduleList.length;i++) {
	fs.access('node_modules/' + moduleList[i], (error) => {
		if(error) {
			console.log(moduleList[i] + ' - is not installed..');
		} else {
			console.log(moduleList[i] + ' - is installed');
		};
	});
};
