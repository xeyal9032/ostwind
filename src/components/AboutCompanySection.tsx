type Card = {
  number: number;
  title: string;
  text: string;
};

export default function AboutCompanySection({
  sectionTitle,
  cards,
}: {
  sectionTitle: string;
  cards: Card[];
}) {
  return (
    <section className="mb-24 rounded-3xl bg-gradient-to-br from-[#4a1818] via-[#2d0e0e] to-[#1a0808] px-6 py-14 sm:px-10 sm:py-16 shadow-2xl">
      <h2 className="text-2xl sm:text-3xl font-bold text-white mb-12 sm:mb-14">{sectionTitle}</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
        {cards.map((card) => (
          <div key={card.number} className="flex flex-col">
            {card.title ? (
              <>
                <div className="flex items-start gap-4 mb-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#c41e3a] text-lg font-bold text-white shadow-lg">
                    {card.number}
                  </span>
                  <h3 className="text-xl font-bold text-white pt-1.5 leading-snug">{card.title}</h3>
                </div>
                <p className="text-gray-200/90 text-base leading-relaxed md:pl-14">{card.text}</p>
              </>
            ) : (
              <>
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#c41e3a] text-lg font-bold text-white shadow-lg mb-4">
                  {card.number}
                </span>
                <p className="text-gray-200/90 text-base leading-relaxed">{card.text}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
