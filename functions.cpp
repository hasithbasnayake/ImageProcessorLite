// #define STB_IMAGE_IMPLEMENTATION
// #include "stb_image/stb_image.h"
// #include "functions.h"
#include <cstdint>
#include <emscripten.h>

// using namespace std;

void math_px(unsigned char* p, int val) {
    int px_sum = *p + val;
    *p = (uint8_t)(px_sum > 255 ? 255 : px_sum < 0 ? 0 : px_sum);
}

extern "C" {
    EMSCRIPTEN_KEEPALIVE
    void brighten_img(unsigned char* editable_img, size_t img_size) {
        for (unsigned char* p = editable_img; p !=editable_img + img_size; p++) {
            math_px(p, 100);
        }
    }
}


// unsigned char* load_img(const char* img_name, int& width, int& height, int& channels) {
//     unsigned char* img = stbi_load(img_name, &width, &height, &channels, 0);
//     if (img == NULL) {
//         printf("Error in image loading");
//         exit(1);
//     }
//     printf("Loaded image with %dpx width, %dpx height, and %d channels", width, height, channels);
//     return img;
// }

// void grayscale_img(unsigned char* editable_img, size_t img_size, int channels) {
//     for (unsigned char* p = editable_img; p != editable_img + img_size; p += channels) {
//         uint8_t px_grayscale = (uint8_t)(0.21 * *p + 0.72 * *(p+1) + 0.07 * *(p+2));
//         *p = *(p+1) = *(p+2) = px_grayscale;
//     }
// }

// void darken_img(unsigned char* editable_img, size_t img_size) {
//     for (unsigned char* p = editable_img; p !=editable_img + img_size; p++) {
//         math_px(p, -10);
//     }
// }

// void invert_img(unsigned char* editable_img, size_t img_size) {
//     for (unsigned char* p = editable_img; p !=editable_img + img_size; p++) {
//         *p = 255 - *p;
//     }
// }