#define STB_IMAGE_WRITE_IMPLEMENTATION
#include "stb_image/stb_image_write.h"
#include "stb_image/stb_image.h"
#include "functions.h"

using namespace std;

int main() {
    int width, height, channels;
    unsigned char *org_img = load_img("koala.png", width, height, channels);

    size_t img_size = width * height * channels;
    unsigned char *editable_img = new unsigned char[img_size];
    memcpy(editable_img, org_img, img_size);

    // grayscale_img(editable_img, img_size, channels);
    // brighten_img(editable_img, img_size);
    // darken_img(editable_img, img_size);
    // invert_img(editable_img, img_size);
    
    stbi_write_png("koala_grayscale.png", width, height, channels, editable_img, width * channels);

    stbi_image_free(org_img);
    delete[] editable_img;

}

