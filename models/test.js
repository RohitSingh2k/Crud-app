const bcrypt = require('bcryptjs');

const password = "sunil";

async function pass_generate(admin){
    const hasdPsw = await bcrypt.hash(admin, 12);
    console.log(hasdPsw);
}

pass_generate(password);