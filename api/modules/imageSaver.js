var q = require('q');

module.exports = {
  SaveImage : function(userUploadedFeedMessagesLocation,base64Data){
    var defer  = q.defer();
    // Save base64 image to disk
      try
      {
          function decodeBase64Image(dataString)
          {
              var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
              var response = {};

              if (!matches ||matches.length !== 3)
              {
                  return new Error('Invalid input string');
              }

              response.type = matches[1];
              response.data = new Buffer(matches[2], 'base64');

              return response;
          }

          // Regular expression for image type:
          // This regular image extracts the "jpeg" from "image/jpeg"
          var imageTypeRegularExpression      = /\/(.*?)$/;

          // Generate random string
          var crypto                          = require('crypto');
          var seed                            = crypto.randomBytes(20);
          var uniqueSHA1String                = crypto
              .createHash('sha1')
              .update(seed)
              .digest('hex');

          //var base64Data = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAZABkAAD/4Q3zaHR0cDovL25zLmFkb2JlLmN...';
                  // Save decoded binary image to disk
          try
          {
              var imageBuffer = decodeBase64Image(base64Data);

              if(!imageBuffer
                      .type){
                  defer.reject(new Error("BASE 64 INVALID"));
              } else {

                  //var userUploadedFeedMessagesLocation = '../img/upload/feed/';

                  var uniqueRandomImageName = 'image-' + uniqueSHA1String;
                  // This variable is actually an array which has 5 values,
                  // The [1] value is the real image extension
                  var imageTypeDetected = imageBuffer
                      .type
                      .match(imageTypeRegularExpression);

                  var userUploadedImagePath = userUploadedFeedMessagesLocation +
                      uniqueRandomImageName +
                      '.' +
                      imageTypeDetected[1];

                  require('fs').writeFile(userUploadedImagePath, imageBuffer.data,
                      function () {
                          defer.resolve({
                              imgUrl: userUploadedFeedMessagesLocation,
                              imgName: uniqueRandomImageName + '.' + imageTypeDetected[1],
                              host: "http://" + (process.env.OPENSHIFT_GEAR_DNS || "localhost:3000")
                          });
                      });
              }
          }
          catch(error)
          {
              defer.reject(error);
          }

      }
      catch(error)
      {
          defer.reject(error);
      }

      return defer.promise;
  }
};
