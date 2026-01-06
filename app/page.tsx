import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      
      {/* Header */}
      <header className="flex items-center justify-between px-10 py-6 border-b border-gray-800">
        <div className="flex items-center gap-3">
          <Image
            src="/logo/logo.png"
            alt="RentalPins Logo"
            width={40}
            height={40}
          />
          <span className="text-2xl font-bold">RentalPins</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-10 py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold leading-tight">
            Discover Rentals Around You
          </h1>

          <p className="mt-6 text-lg text-gray-300 max-w-xl">
            RentalPins is a location-based rental marketplace that helps users
            discover and list rental properties and services across India.
          </p>

          <p className="mt-4 text-gray-400 max-w-xl">
            We connect renters with property owners and service providers in a
            simple, transparent, and secure way.
          </p>
        </div>

        <div className="relative w-full h-72 md:h-96">
          <Image
            src="/images/hero.jpg"
            alt="Rental marketplace map view"
            fill
            className="object-cover rounded-xl opacity-90"
          />
        </div>
      </section>

      {/* Categories Section */}
      <section className="px-10 py-20">
        <h2 className="text-3xl font-bold text-center">
          Browse by Category
        </h2>

        <p className="mt-4 text-center text-gray-400 max-w-2xl mx-auto">
          Explore rentals and services across multiple categories using
          location-based discovery.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

          <Category title="Properties" color="#4F8CFF" desc="Houses, apartments, rooms, villas, and more." />
          <Category title="Vehicles" color="#38D9E6" desc="Cars, bikes, scooters, and self-drive rentals." />
          <Category title="Services" color="#FF5A5F" desc="Home services, repairs, movers, and maintenance." />
          <Category title="Commercial Spaces" color="#FF8A2A" desc="Offices, shops, warehouses, and co-working spaces." />
          <Category title="Lifestyle & Events" color="#FFC44D" desc="Event venues, furniture, equipment, and more." />
          <Category title="Education & Learning" color="#6C7CFF" desc="Coaching centers, tutors, and study spaces." />

        </div>
      </section>

      {/* How It Works */}
      <section className="px-10 py-16 bg-zinc-900">
        <h2 className="text-3xl font-bold text-center">
          How RentalPins Works
        </h2>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <Step title="Discover" desc="Find rentals near you using map-based discovery." />
          <Step title="Connect" desc="Contact owners or service providers directly." />
          <Step title="Rent" desc="Finalize arrangements transparently and securely." />
        </div>
      </section>

      {/* Footer */}
      <footer className="px-10 py-10 border-t border-gray-800 text-sm text-gray-400">
        <div className="flex flex-wrap gap-6">
          <a href="/about">About</a>
          <a href="/contact">Contact</a>
          <a href="/privacy-policy">Privacy Policy</a>
          <a href="/terms">Terms</a>
          <a href="/refund-policy">Refund Policy</a>
        </div>

        <p className="mt-6">
          © {new Date().getFullYear()} RentalPins. All rights reserved.
        </p>
      </footer>
    </main>
  );
}

/* Helper Components */

function Category({
  title,
  color,
  desc,
}: {
  title: string;
  color: string;
  desc: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-[#0F0F0F] border border-gray-800">
      <div className="text-xl font-semibold" style={{ color }}>
        {title}
      </div>
      <p className="mt-3 text-gray-400">{desc}</p>
    </div>
  );
}

function Step({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="bg-black p-6 rounded-xl border border-gray-800">
      <h3 className="text-xl font-semibold">{title}</h3>
      <p className="mt-3 text-gray-400">{desc}</p>
    </div>
  );
}
