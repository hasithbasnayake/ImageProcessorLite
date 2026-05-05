let Module = await createModule();
let numBytes = null;
let img_ptr = null; 
let backup_img_ptr = null;
let img_size = null;
let imageData = null;

document.querySelector('.file-uploader').addEventListener('change', upload);
document.querySelector('.invert-button').addEventListener('click', invertImage);

async function upload() {

    const canvas = document.querySelector('.image-preview');
    const prompt = document.querySelector('.prompt');
    const ctx = canvas.getContext('2d');

    const fileUploadInput = document.querySelector('.file-uploader');
    const image = fileUploadInput.files[0];

    // Handle memory dealocation when a user re-uploads 
    if (img_ptr || backup_img_ptr) {
        Module._free(img_ptr);
        Module._free(backup_img_ptr);
    }

    const bitmap = await createImageBitmap(image);
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    ctx.drawImage(bitmap, 0, 0);
    canvas.hidden = false;
    prompt.hidden = true;

    imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    numBytes = imageData.data.length;

    img_ptr = Module._malloc(numBytes);
    backup_img_ptr = Module._malloc(numBytes);

    Module.HEAPU8.set(imageData.data, img_ptr);
    Module.HEAPU8.set(imageData.data, backup_img_ptr);

}      

function invertImage() {

    const canvas = document.querySelector('.image-preview');
    const ctx = canvas.getContext('2d');
    
    const fileUploadInput = document.querySelector('.file-uploader');
    const image = fileUploadInput.files[0];

    if (!image) {
        console.log("Image not uploaded")
        return null
        // Fill in with logic to trigger a state change to cause a tooltip to appear off the button
    }

    Module._invert_img(img_ptr, numBytes, 4);

    imageData.data.set(Module.HEAPU8.subarray(img_ptr, img_ptr + numBytes));

    ctx.putImageData(imageData, 0, 0)

}

//     imageData.data.set(Module.HEAPU8.subarray(output_ptr, output_ptr + numBytes));

//     Module._free(ptr);
//     Module._free(output_ptr);
//     Module._free(kernel_ptr)


//     console.log(imageData);

//     const output_canvas = document.getElementById('output-canvas');
//     const output_ctx = output_canvas.getContext('2d');
//     output_ctx.putImageData(imageData, 0, 0)

    // try {

    //     const Module = await createModule();

    // }



// async function upload() {

//     const fileUploadInput = document.querySelector('.file-uploader');
//     const image = fileUploadInput.files[0];

//     const bitmap = await createImageBitmap(image);
//     const canvas = document.createElement('canvas');
//     canvas.width = bitmap.width; 
//     canvas.height = bitmap.height;

//     const ctx = canvas.getContext('2d');
//     ctx.drawImage(bitmap, 0, 0);
//     const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

//     const Module = await createModule();

//     const numBytes = imageData.data.length;
//     const ptr = Module._malloc(numBytes);
//     const output_ptr = Module._malloc(numBytes);

//     Module.HEAPU8.set(imageData.data, ptr);

//     const blurKernel = new Float32Array([
//     -1, -1, -1,
//     -1,  8, -1,
//     -1, -1, -1
//     ]);

//     const kernelBytes = blurKernel.length * blurKernel.BYTES_PER_ELEMENT;
//     const kernel_ptr = Module._malloc(kernelBytes);

//     Module.HEAPF32.set(blurKernel, kernel_ptr / 4);

//     Module._convolve_img(ptr, output_ptr, kernel_ptr, 3, canvas.height, canvas.width);

//     imageData.data.set(Module.HEAPU8.subarray(output_ptr, output_ptr + numBytes));

//     Module._free(ptr);
//     Module._free(output_ptr);
//     Module._free(kernel_ptr)


//     console.log(imageData);

//     const output_canvas = document.getElementById('output-canvas');
//     const output_ctx = output_canvas.getContext('2d');
//     output_ctx.putImageData(imageData, 0, 0)

// }