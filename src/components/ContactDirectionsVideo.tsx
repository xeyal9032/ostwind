type ContactDirectionsVideoProps = {
  title: string;
  description: string;
  src: string;
};

export default function ContactDirectionsVideo({
  title,
  description,
  src,
}: ContactDirectionsVideoProps) {
  return (
    <section className="mt-16 lg:mt-20">
      <div className="text-center mb-8 max-w-2xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {title}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">{description}</p>
      </div>

      <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl border border-gray-200 bg-black shadow-xl dark:border-zinc-700">
        <video
          className="w-full aspect-video object-contain bg-black"
          controls
          playsInline
          preload="metadata"
          aria-label={title}
        >
          <source src={src} type="video/mp4" />
        </video>
      </div>
    </section>
  );
}
