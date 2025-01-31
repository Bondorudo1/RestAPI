

import {hashPassword, verifyPassword} from "../helpers/index"

const testPasswordHashing = async () => {
   const password = "test123";
   const hashed = await hashPassword(password);
   const isMatch = await verifyPassword(password, hashed);
 
   console.log("Hashed Password:", hashed);
   console.log("Password Match:", isMatch);
 };
 
 testPasswordHashing();
 