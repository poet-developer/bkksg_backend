const db = require("../lib/db");
const { s3 } = require("../lib/aws")

module.exports = {
  contentList: async(req, res) => {
    try{
      await db.query("SELECT * FROM type", (err, types) => {
      if (err) throw err;
           db.query(
            `SELECT content.id,content.title,content.description,topic,cover_src, public FROM content LEFT JOIN type ON content.type_id = type.id `,
              (err1, contents) => {
            if (err1) throw err1;
              res.status(200).send(
                {contents, types}
              );
            });
          });
    }catch(err){
      console.log(err);
      res.status(400).json({message: err.message})
    }
  },
  
  create: async(req, res, id) => {
    const info = req.body;
    let _c,_public;
    console.log('프로세스로 넘어옴',info);
    try{
      if(info.type === '1' || info.type === '2') _c = info.color
      else if(info.type === '3' || info.type === '4') _c = id.replace("raw/","")

      _public = filterPublic(info.public);

      await db.query("INSERT INTO content (title, description, cover_src, type_id, public) VALUES (?, ?, ?, ?, ?)", [info.title, info.desc, _c , info.type, _public] ,(err, result) => {
        if (err) throw err;
        console.log('Uploded Contents!');
        res.status(200).send();
      });
    }catch(err){
      console.log(err);
      res.status(400).json({message: err.message})
    }
  },

  update: async (req, res) => {
    const info = req.body;
    let _c, _public;
    try{
      if(Number(info.type) === 1 || Number(info.type) === 2) _c = info.color
      else _c = info.img_id
      _public = filterPublic(info.public);
      await db.query(`UPDATE content SET title=?, description=?, cover_src=?, type_id=?, public=? WHERE id =?`,[info.title, info.desc, _c, info.type, _public, info.id],function(error,result){
        if(error) throw error
        if(result) console.log('fixed.')
        res.status(200).send();
      });
    }catch(err){
      console.log(err);
      res.status(400).json({message: err.message})
    }
  },

  delete: async (req, res) => {
    const info = req.body;
    try{
    await db.query(`DELETE FROM content WHERE id =?`,[info.id],function(error,result){
      if(error) throw error;
      if(info.type === 3 || info.type === 4) {
        s3.deleteObject({Bucket: "bkksg-images",
                         Key: `raw/${info.cover_src}`},
                        (err, data) =>{
                          if(err) throw err;
                        });
        console.log('Delete Completed.');                
        res.status(200).send();
      }
    })
    }catch(err){
      console.log(err);
      res.status(400).json({message: err.message})
    }
  },

  read: async (req, res) => {
    const info = req.query;
    try{
      await db.query('SELECT id,title,description,cover_src,type_id,public FROM content WHERE content.id = ?',[info.id],(error, content) => {
        if(error) throw error
          res.status(200).send(content[0]);
      });
    }catch(err){
      console.log(err);
      res.status(400).json({message: err.message})
    }
  },

  getTypeContent : async (req, res) => {
    const info = req.query;
    let _query;
    try{
      if(info.mode === 'home'){
        _query = `SELECT content.id,content.title,content.description,topic,cover_src FROM content LEFT JOIN type ON content.type_id = type.id WHERE public = 1 ORDER BY content.id DESC`
      }else{
        _query = `SELECT content.id,content.title,content.description,topic,cover_src FROM content LEFT JOIN type ON content.type_id = type.id WHERE topic = ? and public = 1 ORDER BY content.id DESC`
      }

      await db.query(
        _query,[info.mode],
        (err, contents) => {
          if (err) throw err;
          res.status(200).send(
            {contents}
          );
        });
    }catch(err){
      console.log(err);
      res.status(400).json({message: err.message})
    }
  }
}


const filterPublic = (data) =>{
  if(data === 'true' || data === '1') return 1
  else return 0
}