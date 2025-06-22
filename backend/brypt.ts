//bcrypt config

import * as bcrypt from 'bcrypt';

//password generation
async function hasher(input: string) {
    var output = await bcrypt.hash(input, 10)
    return output;
}

async function main(){
    hasher('21').then(hash=>console.log(hash))
}

main();
