#include <cstdint>
#include <stdint.h>
#include <math.h>
#include <emscripten.h>

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

    EMSCRIPTEN_KEEPALIVE
    void convolve_img(unsigned char* editable_img, unsigned char* output_img, float* kernel, int kernel_size, int img_height, int img_width) {

        int kernel_half = kernel_size / 2;

        for (int y = 0; y < img_height; y++) {
            for (int x = 0; x < img_width; x++) {

                float r = 0;
                float g = 0;
                float b = 0;

                for (int ky = -kernel_half; ky <= kernel_half; ky++) {
                    for (int kx = -kernel_half; kx <= kernel_half; kx++) {

                        int px = x + kx;
                        int py = y + ky;

                        if (px < 0) px = 0;
                        if (px >= img_width) px = img_width - 1;
                        if (py < 0) py = 0;
                        if (py >= img_height) py = img_height - 1;

                        int idx = (py * img_width + px) * 4;
                        int kdx = (ky + kernel_half) * kernel_size + (kx + kernel_half);

                        r += editable_img[idx] * kernel[kdx];
                        g += editable_img[idx + 1] * kernel[kdx];
                        b += editable_img[idx + 2] * kernel[kdx];

                    }
                }

                int odx = (y * img_width + x) * 4;

                output_img[odx] = fmin(fmax(r, 0), 255);
                output_img[odx + 1] = fmin(fmax(g, 0), 255);
                output_img[odx + 2] = fmin(fmax(b, 0), 255);
                output_img[odx + 3] = editable_img[odx + 3];
            
            }
        }
    }
}