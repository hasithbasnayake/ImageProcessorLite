async function upload() {

    const fileUploadInput = document.querySelector('.file-uploader');
    const image = fileUploadInput.files[0];

    const bitmap = await createImageBitmap(image);
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width; 
    canvas.height = bitmap.height;

    const ctx = canvas.getContext('2d');
    ctx.drawImage(bitmap, 0, 0);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const Module = await createModule();

    const numBytes = imageData.data.length;
    const ptr = Module._malloc(numBytes);

    Module.HEAPU8.set(imageData.data, ptr);

    Module._brighten_img(ptr, numBytes);

    imageData.data.set(Module.HEAPU8.subarray(ptr, ptr + numBytes));

    Module._free(ptr);

    console.log(imageData);

    const output_canvas = document.getElementById('output-canvas');
    const output_ctx = output_canvas.getContext('2d');
    output_ctx.putImageData(imageData, 0, 0)

}