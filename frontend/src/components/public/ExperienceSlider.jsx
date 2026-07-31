import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import slides from "@/data/experienceSlides";

const ExperienceSlider = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
    },
    [
      Autoplay({
        delay: 4500,
        stopOnInteraction: false,
      }),
    ]
  );

  const scrollPrev = useCallback(() => {
    emblaApi && emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    emblaApi && emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className="relative">

      <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide) => (
            <div className="min-w-0 flex-[0_0_100%]" key={slide.id}>
              <div className="relative h-[550px] overflow-hidden rounded-3xl">
                <img
                  src={slide.image}
                  alt={slide.title}
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-3xl font-bold">
                    {slide.title}
                  </h3>

                  <p className="mt-3 max-w-lg text-lg text-gray-200">
                    {slide.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={scrollPrev}
        className="absolute left-5 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={scrollNext}
        className="absolute right-5 top-1/2 -translate-y-1/2 rounded-full bg-white p-3 shadow-lg"
      >
        <ChevronRight />
      </button>

    </div>
  );
};

export default ExperienceSlider;