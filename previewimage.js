function previewImages() {

  var preview = document.querySelector('#preview');
  
  if (this.files) {
    [].forEach.call(this.files, readAndPreview);
  }

  function readAndPreview(file) {

    // Make sure `file.name` matches our extensions criteria
    if (!/\.(jpe?g|png|gif)$/i.test(file.name)) {
      return alert(file.name + " is not an image");
    } // else...
    
    var reader = new FileReader();
    
    reader.addEventListener("load", function() {
      var image = new Image();
      image.height = 100;
      image.title  = file.name;
      image.src    = this.result;
      preview.appendChild(image);
    });
    
    reader.readAsDataURL(file);
    
  }
  
  "use strict";

window.onload = (async function () {
  const compressor = new window.Compress();
  const browserSupportsExifOrientation = () => {
    return new Promise((resolve) => Modernizr.on("exiforientation", resolve));
  };

  // Only rotate if browser does not support exit orientation.
  const shouldRotate = async () => {
    const supported = await browserSupportsExifOrientation();
    return !supported;
  };
  const rotate = await shouldRotate();
  console.log({ rotate });

  const upload = document.getElementById("upload");
  const preview = document.getElementById("preview");
  upload.addEventListener(
    "change",
    async function (evt) {
      const files = [...evt.target.files];
      const results = await compressor.compress(files, {
        size: 4,
        quality: 0.75,
        rotate,
      });
      const output = results[0];
      const file = Compress.convertBase64ToFile(output.data, output.ext);
      console.log(file);
      preview.src = output.prefix + output.data;
    },
    false
  );
})();
