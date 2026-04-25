async function upload() {

    const canvas = document.querySelector('.image-preview');
    const prompt = document.querySelector('.prompt');
    const ctx = canvas.getContext('2d');

    const fileUploadInput = document.querySelector('.file-uploader');
    const image = fileUploadInput.files[0];

    const bitmap = await createImageBitmap(image);
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;

    ctx.drawImage(bitmap, 0, 0);
    canvas.hidden = false;
    prompt.hidden = true;

}

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