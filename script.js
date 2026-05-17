let Module = await createModule();
let numBytes = null;
let img_ptr = null; 
let backup_img_ptr = null;
let img_height = null;
let img_width = null;
let imageData = null;

// const blurKernel = new Float32Array([
//     -1, -1, -1,
//     -1,  8, -1,
//     -1, -1, -1
//     ]);
// const kernel_size = 3;

const blurKernel = new Float32Array([
    2/159,  4/159,  5/159,  4/159, 2/159,
    4/159,  9/159, 12/159,  9/159, 4/159,
    5/159, 12/159, 15/159, 12/159, 5/159,
    4/159,  9/159, 12/159,  9/159, 4/159,
    2/159,  4/159,  5/159,  4/159, 2/159,
]);
const kernel_size = 5;
const kernelBytes = blurKernel.length * blurKernel.BYTES_PER_ELEMENT;
const kernel_ptr = Module._malloc(kernelBytes);
Module.HEAPF32.set(blurKernel, kernel_ptr / 4);

// Define eventListeners and attach image manipulation functions
document.querySelector('.file-uploader').addEventListener('change', upload);
document.querySelector('.invert-button').addEventListener('click', invertImage);
document.querySelector('.grayscale-button').addEventListener('click', grayscaleImage);
document.querySelector('.blur-button').addEventListener('click', blurImage);
document.querySelector('.reset-button').addEventListener('click', resetImage);


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
    img_height = canvas.height; 
    img_width = canvas.width; 
    numBytes = imageData.data.length;

    img_ptr = Module._malloc(numBytes);
    backup_img_ptr = Module._malloc(numBytes);

    Module.HEAPU8.set(imageData.data, img_ptr);
    Module.HEAPU8.set(imageData.data, backup_img_ptr);

}      

function saveImage () {
    return null
}

function resetImage() {

    if (returnImage()) {
        const canvas = document.querySelector('.image-preview');
        const ctx = canvas.getContext('2d');

        imageData.data.set(Module.HEAPU8.subarray(backup_img_ptr, backup_img_ptr + numBytes));
        ctx.putImageData(imageData, 0, 0);
    }
}

function returnImage() {

    const fileUploadInput = document.querySelector('.file-uploader');
    const image = fileUploadInput.files[0];

    if (!image) {
        return false
    }
    return true

}

function blurImage() {

    if (returnImage()) {
        const canvas = document.querySelector('.image-preview');
        const ctx = canvas.getContext('2d');

        const out_ptr = Module._malloc(numBytes)

        Module._convolve_img(img_ptr, out_ptr, kernel_ptr, kernel_size, img_height, img_width);
        imageData.data.set(Module.HEAPU8.subarray(out_ptr, out_ptr + numBytes));
        ctx.putImageData(imageData, 0, 0);

        Module.HEAPU8.copyWithin(img_ptr, out_ptr, out_ptr + numBytes);
        Module._free(out_ptr);
    }

}

function grayscaleImage() {

    if (returnImage()) {
        const canvas = document.querySelector('.image-preview');
        const ctx = canvas.getContext('2d');

        Module._grayscale_img(img_ptr, numBytes, 4);
        imageData.data.set(Module.HEAPU8.subarray(img_ptr, img_ptr + numBytes));
        ctx.putImageData(imageData, 0 , 0);
    }

}

function invertImage() {

    if (returnImage()) {
        const canvas = document.querySelector('.image-preview');
        const ctx = canvas.getContext('2d');
        
        Module._invert_img(img_ptr, numBytes, 4);
        imageData.data.set(Module.HEAPU8.subarray(img_ptr, img_ptr + numBytes));
        ctx.putImageData(imageData, 0, 0)
    }
    else {
        // render tooltip 
        console.log("Image not uploaded");
    }
}