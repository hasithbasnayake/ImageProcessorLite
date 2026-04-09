#ifndef FUNCTIONS_H
#define FUNCTIONS_H
#include <cstddef>


unsigned char* load_img(const char* img_name, int& width, int& height, int& channels);
void grayscale_img(unsigned char* editable_img, size_t img_size, int channels);
void brighten_img(unsigned char* editable_img, size_t img_size);
void darken_img(unsigned char* editable_img, size_t img_size);
void invert_img(unsigned char* editable_img, size_t img_size);

#endif