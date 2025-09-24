const bcrypt = require("bcryptjs");

(async ()=>{
    const password = "Admin@123"; // pick a strong password!
    const hash = await bcrypt.hash(password, 10);
    console.log("Your hashed password:", hash);
})();
