import bcryptjs from "bcryptjs";

const encryptPass = async(pass) =>{
    try {
        const hashPass = await bcryptjs.hash(pass,12);
        return hashPass;
    } catch (error) {
        
    }
}

const decryptPass = async(pass,{ password }) =>{
    try {
        const compPass = await bcryptjs.compare(pass,password);
        return compPass;
    } catch (error) {
        
    }
}

export { encryptPass,decryptPass }