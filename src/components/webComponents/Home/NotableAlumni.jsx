import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./Home.css"; // Your custom styles (keep or modify)

const alumni = [
  {
    name: "A. M. Naik",
    image: "naik.jpg",
    description: "Group Chairman, Larsen & Turbo Limited India",
  },
  {
    name: "Nitin Desai",
    image: "desai.jpg",
    description: "Desai Brothers Limited",
  },
  {
    name: "Anilbhai Bakeri",
    image: "anil.jpg",
    description: "Bakeri Associates Ahmedabad",
  },
  {
    name: "Ashokbhai C. Patel",
    image: "ashok.jpg",
    description:
      "Principal Phoenix Arizona USA and donor of Ashok Rita Patel Institute of Integrate Biotechnology, New Vidyanagar",
  },
  {
    name: "M.N.Patel",
    image: "mnPatel.jpg",
    description: "Ex-Principal, L.D.College of Engineering Ahmedabad",
  },
   {
    name: "Kishor B.Virani",
    image: "kishor.jpg",
    description: "MD of Karp Impex Limited Surat",
  },
   {
    name: "Bharatsinh Solanki",
    image: "kishor.jpg",
    description: "Ex-President of Gujarat Pradesh Congress Committee",
  },
];

const NotableAlumni = () => {
  return (
    <div className="p-6 bg-gray-100">
      <h2 className="text-3xl font-semibold mb-6 text-center">Notable Alumni</h2>

      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        breakpoints={{
          640: { slidesPerView: 1 },
          768: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
      >
        {alumni.map((alum, index) => (
          <SwiperSlide key={index}>
            <div className="bg-white rounded-md shadow-md h-[350px] overflow-hidden">
              <div className="bg-indigo-900 p-6 flex flex-col items-center">
                <img
                  src={alum.image}
                  alt={alum.name}
                  className="w-28 h-28 rounded-full object-cover border-4 border-white mb-4"
                />
              </div>
              <div className="p-4 text-center">
                <h3 className="font-semibold text-lg">{alum.name}</h3>
                <p className="text-xl text-gray-600 mt-1 line-clamp-4">
                  {alum.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default NotableAlumni;
