const adminAuth = (req,res,next)=>{
    console.log("Admin authenticated successfully!!");
    const token = "xyz";
    const isAdminAuthenticate = (token === "xyz");
    if(isAdminAuthenticate){
       next();
    }
    else{
        res.status(401).send("Unathorised user");
    }
};

const userAuth = (req,res,next)=>{
    console.log("User authenticated successfully!!");
    const token = "xyz";
    const isAdminAuthenticate = (token === "xyz");
    if(isAdminAuthenticate){
       next();
    }
    else{
        res.status(401).send("Unathorised user");
    }
};

module.exports = {
    adminAuth,
    userAuth,
}