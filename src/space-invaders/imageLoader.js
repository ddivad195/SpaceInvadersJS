// David Daly - 13504817
// CT404 Graphics & Image Processing Assignment

// Takes in strings containing the image path and creates image objects using them
// Allows new images to be added easily without needing to change the Game class, allowing for greater extensability

function ImageLoader() {
}

// module.exports = ImageLoader;

var loadedImages = {};

ImageLoader.prototype.loadImages = function(images) {
    // Add empty array to object based on the arrays passed in from index.html
    var keys = Object.keys(images);
    for(var i=0; i<keys.length; i++){
        loadedImages[keys[i]] = [];
        //Create image object from path and add it to loaded images array
        images[keys[i]].forEach(function(image) {
            var img = new Image();

            img.src = image;
            loadedImages[keys[i]].push(img);
        });
    }
    //return loaded images to playstate - adding them to the Game constants
    return loadedImages;
};
