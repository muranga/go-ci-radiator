
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send("respond with a resource");
  req.io.emit('talk', {
          message: 'io event from an io route on the server'
   })
};

