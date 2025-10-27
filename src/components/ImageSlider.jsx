// components/common/ImageSlider.jsx
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";

const ImageSlider = ({ images, singleView }) => {
  if (!images || images.length === 0) {
    return <p className="text-center text-gray-400">No images available</p>;
  }

  return (
    <div className="rounded-xl">
      <Swiper
        modules={[Pagination, Autoplay]}
        spaceBetween={16}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000 }}
        loop={true}
        className="w-full"
        {...(!singleView && {
          breakpoints: {
            320: {
              slidesPerView: 1,
              spaceBetween: 10,
            },
            640: {
              slidesPerView: 2,
              spaceBetween: 12,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 14,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 16,
            },
          },
        })}
      >
        {images.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="overflow-hidden rounded-xl">
              <img
                src={item.slider_image}
                alt={`Slider ${index + 1}`}
                className="w-full h-64 object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default ImageSlider;
