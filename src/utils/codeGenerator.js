import crypto from "crypto";

const generateCode = (matricula) => {
    const hash = crypto.createHash("sha256").update(matricula + Date.now()).digest("hex");
    
    const accessCode = hash.substring(0, 9).toUpperCase(); 

    return accessCode;
};

export default generateCode;