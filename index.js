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

  let upload = document.getElementById("upload");
  
  let upload2 = document.getElementById("upload2");
  
  
  let preview = document.getElementById("preview");
  let preview2 = document.getElementById("preview2");
  const clearQueue =  document.getElementById("clearQueue");
  
  
  let files = [];
  let files2 = [];
  
  upload.addEventListener(
    "change",
    async function (evt) {
      files = [...evt.target.files];
      const results = await compressor.compress(files, {
        size: 4,
        quality: 0.75,
        rotate,
      });
      console.log(results);
      const output = results[0];
	  
      previewImages(files,"preview");
	  
      //preview.src = output.prefix + output.data;
    },
    false
  );
  
  upload2.addEventListener(
    "change",
    async function (evt) {
      files2 = [...evt.target.files];
      const results = await compressor.compress(files, {
        size: 4,
        quality: 0.75,
        rotate,
      });
      console.log(results);
      const output = results[0];
	  
      previewImages(files2,"preview2");
	  
      //preview.src = output.prefix + output.data;
    },
    false
  );
  
  clearQueue.addEventListener(
    "click",
    async function (evt) {
     document.getElementById("preview").innerHTML = "";
	 document.getElementById("upload").value = "";
    },
    false
  );

  
})();

function previewImages(files,id) {

  var preview = document.getElementById(id);
  
  if (files) {
    [].forEach.call(files, readAndPreview);
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
	  image.setAttribute("style","padding:10px 10px 10px 10px");
	  
	 
	  
      preview.appendChild(image);
	  
	   if(id=="preview2"){
		
     var btn = document.createElement("input");
     btn.setAttribute("type","text");
	 btn.setAttribute("id",file.name);
     btn.setAttribute("value",image.title);		
	 
	   var btn1 = document.createElement("input");
     btn1.setAttribute("type","button");
     btn1.setAttribute("value","save");	

     	 
	 
	 
		   
	   preview.appendChild(btn); 
       preview.appendChild(btn1); 	

  btn1.addEventListener(
    "click",
    async function (evt) {
		var img = document.getDocumentById(file.name);
		img.title = bt1.getAttribute("value");
    },
    false
  );	   
		  
	  }
	  
	 
    });
    
    reader.readAsDataURL(file);
	
	
    
  }
};

function downloadAll(){
	
var fileURLs = document.querySelectorAll("img");

       var zip = new JSZip();	
		
        zip.file("im1.jpg",fileURLs[0], {base64: true});
        zip.file("im2.jpg",fileURLs[1], {base64: true});
        zip.generateAsync({type:"blob"}).then(function(content) {
            saveAs(content, "download.zip");
        }); 


};

function downloadSimple(){
	
	let images = document.querySelectorAll("img");
for (let i of images) {
    var a = document.createElement('a');
    a.href = i.src;
    console.log(i);
    a.download = i.src;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}
	
};




