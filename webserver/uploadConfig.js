const multer=require('multer');
const path=require('path');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'F:/BakBak/webserver/uploads');
    },
    filename: (req, file, cb) => {
        console.log(file);
        var d=new Date();
        cb(null, file.originalname);
        
    }
});
const upload = multer({ storage: storage }).array('s_file',4);
module.exports=upload;