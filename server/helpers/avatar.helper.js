'use strict';

var util = require('util');
var formidable = require('formidable');
var fs = require('fs-extra');
var mime = require('mime');
var config = require('../config/environment');
var log = require('winston');

/*
 * Returns a string representation of the file extension (e.g. '.png' for 'default.png')
 */
function getFileExtension(curFileName) {
    return curFileName.substr(curFileName.lastIndexOf('.'), curFileName.length);
}

/*
 * Returns the mimetype for a given filename.
 */
function getMimeType(fileName) {
    return mime.lookup(fileName);
}

/*
 * Returns true if the mimetype is valid. False otherwise.
 */
function isValidMimeType(mimeType) {
    for (var i = 0; i < config.validAvatarMimeTypes.length; i++) {
        if (config.validAvatarMimeTypes[i] === mimeType) {
            return true;
        }
    }
    return false;
}

/* 
 * Helper to upload an avatar for a user request.
 */
exports.uploadAvatar = function(req, res, callback) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        if (form.bytesExpected > 3000000) {
            return res.send(413, 'Uploaded file must be smaller than X bytes.');
        }
    });

    form.on('end', function(fields, files) {
        var fileTempLocation = this.openedFiles[0].path;
        var fileName = this.openedFiles[0].name;
        var fileExtension = getFileExtension(fileName);
        var mimeType = getMimeType(fileName);
        
        if (!isValidMimeType(mimeType)) {
            res.send(415, 'Invalid file extension.');
        }
        
        // Everything's good to go. Upload the file.
        var newFileLocation = 'uploads/';
        var newFileName = req.user._id;

        fs.copy(fileTempLocation, newFileLocation + newFileName, function(err) {  
            if (err) {
                return res.send(500, 'Server error processing uploaded avatar.');
            } else {
                return res.send(200, 'Success');
            }
        });
        
        if (callback) callback(newFileName, fileExtension);
    });
};

exports.getAvatar = function(req, res, callback) {
    var name = req.params.filename;
    var extension = getFileExtension(name);
    var path = 'uploads/' + req.params.filename;

    if (name === config.defaultAvatarFileName + config.defaultAvatarFileExtension) {
       path = config.defaultAvatarPath;
    }
    var avatar = fs.readFile(path, function(err, data) {
        if (err) {
            log.error(err);
            res.send(404);
        }
        var mimeType = getMimeType(extension);
        if (mimeType) {
            res.writeHead(200, {'Content-Type': mimeType });
            res.end(data, 'binary');
        } else {
            log.error("Could not determine mimtype for avatar request.");
            res.send(404);
        }
    });  
    
    if (callback) callback();
}