import ImageSlider from "./image-slider";

const Hero = () => {
  return (
    <div className="min-h-screen w-full flex flex-col gap-16 items-center justify-center px-6 py-16">
      <div className="text-center max-w-3xl">
        <h1 className="mt-10 text-3xl sm:text-5xl md:text-6xl lg:text-7xl md:leading-[1.2] font-semibold tracking-tighter">
          Empowering Students Through Connected Campus Services
        </h1>
        <p className="mt-6 md:text-lg">
          The Student Affairs and Services provides an easy way for students to
          stay informed about campus events, access student services, and
          explore recognized organizations—all in one centralized platform.
        </p>
        {/* <div className="mt-10 flex items-center justify-center gap-4">
          <Button size="lg" className="rounded-full text-base">
            Explore Now<ArrowUpRight className="h-5! w-5!" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="rounded-full text-base shadow-none"
          >
            <CirclePlay className="h-5! w-5!" /> view Services
            view services
          </Button>
        </div> */}
      </div>
      <div className="w-full max-w-(--breakpoint-xl) mx-auto aspect-video bg-accent rounded-xl">
        <ImageSlider />
      </div>
    </div>
  );
};

export default Hero;
