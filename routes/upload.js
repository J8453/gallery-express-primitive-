var express = require('express');
var router = express.Router();

// Node.js path api
// https://nodejs.org/api/path.html
const path = require('path');

// Node.js file system api
// https://nodejs.org/api/fs.html
const fs = require('fs');

// Node.js middleware for handling `multipart/form-data`.
// https://github.com/expressjs/multer
const multer = require('multer');
const upload = multer({
  dest: "public/uploads/"
  // you might also want to set some limits: https://github.com/expressjs/multer#limits
});


const Album = require('../model/album.js');
const Image = require('../model/image.js');


const handleError = (err, res) => {
	console.log(err);
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Something went wrong!");
};

function getFileName(folder, imgIndex){
	let lastFileName;
	
	fs.readdirSync(folder).forEach((file,index,arr)=>{
		if ( index === arr.length-1 ) lastFileName = file;
	})
	
	let count;
	if (!lastFileName) {
	  	count = 1
	} else {
	  	count = parseInt(lastFileName.replace('img','').replace('.jpg',''));
	  	count++;
	  	count+=imgIndex; /**/
	}
	
	let name='';
	
	let leng = count.toString().length;
	if (leng<5) {
		for (let i=1; i<=(5-leng); i++) {
			name += '0';
		}
		name += count;

	} else {
		name = count.toString();
  	}

  	return name;
}

// post到/upload：上傳照片並新建相簿
router.post('/',
	upload.array('image'),
	(req, res) => {
		console.log(req.body, req.files);
		const formData = req.body;
		
		let coverSrc;

		// 存圖片進 fs
		const filesArr = req.files;
		filesArr.forEach((file, index)=>{
			const oldPath = file.path;

			const userFolder = path.join(__dirname, `../public/uploads/${req.session.userID}`);
			const targetPath = path.join(__dirname, `../public/uploads/${req.session.userID}/img${getFileName(userFolder, index)}.jpg`);

			if (path.extname(file.originalname).toLowerCase() === ".jpg") {
				
				fs.rename(oldPath, targetPath, err => {
			        if (err) return handleError(err, res); 

			        // res
			        //   .status(200)
			        //   .contentType("application/json")
			        //   // .send({
			        //   // 	message: 'File uploaded successfully.'
			        //   // })
			        //   .redirect('/upload');

			    });
			} else {
				fs.unlink(oldPath, err => {
			        if (err) return handleError(err, res);

			        // res
			        //   .status(403)
			        //   .contentType("text/plain")
			        //   .end("Only .jpg files are allowed!");

			    });
			}

			// 預設第一張為封面
			if (index===0) {
				coverSrc = targetPath.replace(__dirname.replace('/routes','/public'),'');
			}

			filesArr[index].dbSrc = targetPath.replace(__dirname.replace('/routes','/public'),'');
		})

		// 存資料到 db
		Album.create({
			name: formData.name,
			description: formData.description,
			userId: formData.userId,
			coverSrc
		})
			.then(data=>data.dataValues.id)
			.then(album_id=>{
				console.log(filesArr);

				filesArr.forEach(file=>{
					Image.create({
						src: file.dbSrc,
						userId: formData.userId,
						albumId: album_id
					})
					.catch(err=>{
						console.log(err);
					})
				})
			})
			.catch(err=>{
				console.log(err);
			})

		res
		  .status(200)
		  .contentType("application/json")
		  // .send({
		  // 	message: 'File uploaded successfully.'
		  // })
		  .redirect(`/profile?user=${req.session.userID}`);
});

// post到/upload/avatar：上傳頭貼(僅能上傳單張圖片)
router.post('/avatar',
  upload.single("image" /* name attribute of <file> element in your form */),
  (req, res) => {

    const oldPath = req.file.path;
    const targetPath = path.join(__dirname, `../public/uploads/${req.session.userID}/avatar.jpg`);

    if (path.extname(req.file.originalname).toLowerCase() === ".jpg") {
      fs.rename(oldPath, targetPath, err => {
        if (err) return handleError(err, res); 

        res
          .status(200)
          .contentType("application/json")
          .redirect(`/profile?user=${req.session.userID}`);
      });
    } else {
      fs.unlink(oldPath, err => {
        if (err) return handleError(err, res);

        res
          .status(403)
          .contentType("text/plain")
          .end("Only .jpg files are allowed!");
      });
    }
  }
);

// get到/upload/album?id=x：取圖
router.get('/album', function(req, res, next) {
	const queryAlbum = req.query.id; 

	Image.findAll({
		where: {
			albumId: queryAlbum
		}
	})
		.then(dataArr=>{
			ImageArr = [];
			dataArr.forEach(data=>{
				ImageArr.push(data.dataValues);
			});
			res.send(JSON.stringify(ImageArr));
		})
		.catch(err=>console.log(err));
	
});

// post到/upload/album：上傳照片到指定相簿（非同步）
router.post('/album',
	upload.array('image'), 
	(req, res, next) => {

		const filesArr = req.files;
		filesArr.forEach((file, index)=>{
			const oldPath = file.path;

			const userFolder = path.join(__dirname, `../public/uploads/${req.session.userID}`);
			const targetPath = path.join(__dirname, `../public/uploads/${req.session.userID}/img${getFileName(userFolder, index)}.jpg`);

			if (path.extname(file.originalname).toLowerCase() === ".jpg") {
				fs.rename(oldPath, targetPath, err => {
			        if (err) return handleError(err, res); 
			    });
			} else {
				fs.unlink(oldPath, err => {
			        if (err) return handleError(err, res);
			    });
			}

			filesArr[index].dbSrc = targetPath.replace(__dirname.replace('/routes','/public'),'');
		})
		
		let imageArr=[];
	
		filesArr.forEach((file,index)=>{
			Image.create({
				src: file.dbSrc,
				userId: req.query.userid,
				albumId: req.query.id
			})
			.then(data=>{
				imageArr.push(data.dataValues);
				// 這樣寫真ㄉ合理嗎ㄏㄏ
				if (index===filesArr.length-1) {
					console.log(imageArr);
					res.send(JSON.stringify(imageArr));
				}
			})
			.catch(err=>{
				console.log(err);
			})
		});
		
});

module.exports = router;
