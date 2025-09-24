const jwt = require("jsonwebtoken");
module.exports = {
    authMiddleware: (req,res,next) => {
        const header = req.headers.authorization;
        if(!header) return res.status(401).json({msg:"Missing token"});
        const token = header.split(" ")[1];
        try {
            const payload = jwt.verify(token, process.env.JWT_SECRET);
            req.user = { id: payload.id, role: payload.role };
            next();
        } catch(e) {
            return res.status(401).json({msg:"Invalid token"});
        }
    },
    adminOnly: (req,res,next) => {
        if(req.user.role !== "admin") return res.status(403).json({msg:"Forbidden"});
        next();
    }
};
