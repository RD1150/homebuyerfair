import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  MapPin, Calendar, Clock, Users, ChevronDown,
  CheckCircle2, Star, Home as HomeIcon, DollarSign, Utensils,
  Music, Palette, Baby, Phone, Mail, ArrowRight,
  Award, BookOpen, TrendingUp, Shield
} from "lucide-react";

function useIntersectionObserver(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
    }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

export default function Home() {
  const registrationRef = useRef<HTMLDivElement>(null);

  const scrollToRegister = () => {
    registrationRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const heroSection = useIntersectionObserver(0.1);
  const highlightsSection = useIntersectionObserver(0.1);
  const learnSection = useIntersectionObserver(0.1);
  const detailsSection = useIntersectionObserver(0.1);

  const highlights = [
    { icon: DollarSign, label: "FREE Event", sub: "No cost to attend", color: "text-emerald-600" },
    { icon: Award, label: "$58K Assistance", sub: "Down payment programs", color: "text-amber-600" },
    { icon: Utensils, label: "Free Lunch", sub: "Enjoy a complimentary meal", color: "text-blue-600" },
    { icon: Music, label: "Entertainment", sub: "Live fun for everyone", color: "text-purple-600" },
    { icon: Palette, label: "Face Painting", sub: "Kids will love it", color: "text-pink-600" },
    { icon: Baby, label: "Kidz Corner", sub: "Activities for children", color: "text-orange-600" },
  ];

  const learnItems = [
    { icon: BookOpen, text: "Step-by-step home buying process" },
    { icon: DollarSign, text: "How to qualify for up to $58,000 in assistance" },
    { icon: TrendingUp, text: "Credit tips to boost your buying power" },
    { icon: Shield, text: "Loan options & financing strategies" },
    { icon: HomeIcon, text: "How to avoid costly first-time buyer mistakes" },
  ];

  return (
    <div className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>

      {/* ── NAV ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <HomeIcon className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-primary text-sm hidden sm:block">
              Conejo Simi Moorpark Association of REALTORS®
            </span>
            <span className="font-semibold text-primary text-sm sm:hidden">CSMAR®</span>
          </div>
          <Button onClick={scrollToRegister} size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-5">
            Reserve My Spot
          </Button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero-gradient pt-16 min-h-screen flex flex-col justify-center relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full opacity-5 bg-white" />
        <div className="absolute bottom-20 left-10 w-96 h-96 rounded-full opacity-5 bg-white" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03] bg-white" />

        <div ref={heroSection.ref} className="container relative z-10 py-20 text-center">
          {/* Badge */}
          <div className={`inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-2 mb-8 ${heroSection.visible ? "animate-fade-in-up" : "opacity-0"}`}>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-white/90 text-sm font-medium tracking-wide">4th Annual Event · Free Admission</span>
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
          </div>

          {/* Title */}
          <h1 className={`text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-4 leading-tight ${heroSection.visible ? "animate-fade-in-up-delay-1" : "opacity-0"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Homebuyer
            <br />
            <span className="gold-text">Extravaganza</span>
          </h1>

          <p className={`text-2xl sm:text-3xl text-white/80 font-light mb-3 ${heroSection.visible ? "animate-fade-in-up-delay-2" : "opacity-0"}`}
            style={{ fontFamily: "'Playfair Display', serif" }}>
            Home Buying <em>101</em>
          </p>

          <p className={`text-white/60 text-lg mb-10 ${heroSection.visible ? "animate-fade-in-up-delay-2" : "opacity-0"}`}>
            Learn the home buying process from start to finish
          </p>

          {/* Event details pills */}
          <div className={`flex flex-wrap justify-center gap-3 mb-10 ${heroSection.visible ? "animate-fade-in-up-delay-3" : "opacity-0"}`}>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-white">
              <Calendar className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Saturday, April 25, 2026</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-white">
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="font-medium">11:00 AM – 1:30 PM</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-white">
              <MapPin className="w-4 h-4 text-amber-400" />
              <span className="font-medium">Simi Valley, CA</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className={`flex flex-col sm:flex-row gap-4 justify-center ${heroSection.visible ? "animate-fade-in-up-delay-4" : "opacity-0"}`}>
            <Button
              onClick={scrollToRegister}
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-white font-bold text-lg px-10 py-6 rounded-full shadow-2xl shadow-amber-500/30 transition-all duration-300 hover:scale-105"
            >
              Reserve My FREE Spot
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={scrollToRegister}
              className="border-white/30 text-white bg-white/10 hover:bg-white/20 font-semibold text-lg px-10 py-6 rounded-full backdrop-blur-sm"
            >
              Learn More
            </Button>
          </div>


        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </section>

      {/* ── HIGHLIGHTS ── */}
      <section className="py-20 bg-white">
        <div ref={highlightsSection.ref} className="container">
          <div className={`text-center mb-14 ${highlightsSection.visible ? "animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-amber-600 font-semibold tracking-widest uppercase text-sm mb-3">Bonus Experience</p>
            <h2 className="text-4xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Bring the Whole Family
            </h2>
            <hr className="gold-divider w-24 mx-auto mb-4" />
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              This isn't just a workshop — it's a full family experience with something for everyone.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 lg:gap-6">
            {highlights.map((h, i) => (
              <div
                key={h.label}
                className={`feature-card bg-white border border-border rounded-2xl p-6 text-center shadow-sm ${highlightsSection.visible ? `animate-fade-in-up-delay-${Math.min(i + 1, 4)}` : "opacity-0"}`}
              >
                <div className={`inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gray-50 mb-4 ${h.color}`}>
                  <h.icon className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-foreground text-base mb-1">{h.label}</h3>
                <p className="text-muted-foreground text-sm">{h.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU'LL LEARN ── */}
      <section className="py-20 section-alt">
        <div ref={learnSection.ref} className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left: text */}
            <div className={learnSection.visible ? "animate-fade-in-up" : "opacity-0"}>
              <p className="text-amber-600 font-semibold tracking-widest uppercase text-sm mb-3">Workshop Curriculum</p>
              <h2 className="text-4xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                What You'll Learn
              </h2>
              <hr className="gold-divider w-24 mb-6" />
              <p className="text-muted-foreground text-lg mb-8">
                Our expert speakers will walk you through everything you need to know to confidently purchase your first home — from credit preparation to closing day.
              </p>
              <ul className="space-y-4">
                {learnItems.map((item, i) => (
                  <li key={i} className={`flex items-start gap-4 ${learnSection.visible ? `animate-fade-in-up-delay-${Math.min(i + 1, 4)}` : "opacity-0"}`}>
                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground font-medium pt-2">{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right: highlight card */}
            <div className={`${learnSection.visible ? "animate-fade-in-up-delay-2" : "opacity-0"}`}>
              <div className="hero-gradient rounded-3xl p-8 text-white shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 rounded-full bg-white/5" />
                <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-white/5" />
                <div className="relative z-10">
                  <div className="text-center mb-8">
                    <div className="text-6xl font-black gold-text mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>$58K</div>
                    <p className="text-white/90 text-xl font-semibold">Down Payment Assistance</p>
                    <p className="text-white/60 mt-2">Programs Available</p>
                  </div>
                  <hr className="border-white/20 mb-6" />
                  <div className="space-y-3">
                    {["FREE to attend — no cost ever", "Expert REALTOR® guidance", "Family-friendly environment", "Limited seating available"].map((item) => (
                      <div key={item} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-amber-400 flex-shrink-0" />
                        <span className="text-white/90 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    onClick={scrollToRegister}
                    className="w-full mt-8 bg-amber-500 hover:bg-amber-400 text-white font-bold py-5 rounded-xl text-base"
                  >
                    Reserve Your FREE Spot Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── EVENT DETAILS ── */}
      <section className="py-20 bg-white">
        <div ref={detailsSection.ref} className="container">
          <div className={`text-center mb-14 ${detailsSection.visible ? "animate-fade-in-up" : "opacity-0"}`}>
            <p className="text-amber-600 font-semibold tracking-widest uppercase text-sm mb-3">Event Information</p>
            <h2 className="text-4xl font-bold text-primary mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
              Event Details
            </h2>
            <hr className="gold-divider w-24 mx-auto" />
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className={`feature-card bg-white border border-border rounded-2xl p-8 text-center shadow-sm ${detailsSection.visible ? "animate-fade-in-up-delay-1" : "opacity-0"}`}>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Date & Time</h3>
              <p className="text-primary font-semibold text-base">Saturday, April 25, 2026</p>
              <p className="text-muted-foreground mt-1">11:00 AM – 1:30 PM</p>
            </div>

            <div className={`feature-card bg-white border border-border rounded-2xl p-8 text-center shadow-sm ${detailsSection.visible ? "animate-fade-in-up-delay-2" : "opacity-0"}`}>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Location</h3>
              <p className="text-primary font-semibold text-base">Valor Home Finance</p>
              <p className="text-muted-foreground mt-1 text-sm">1555 Simi Town Center Way #640</p>
              <p className="text-muted-foreground text-sm">Simi Valley, CA 93065</p>
              <a
                href="https://maps.google.com/?q=1555+Simi+Town+Center+Way+640+Simi+Valley+CA+93065"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-amber-600 hover:text-amber-700 text-sm font-medium mt-3 transition-colors"
              >
                Get Directions <ArrowRight className="w-3 h-3" />
              </a>
            </div>

            <div className={`feature-card bg-white border border-border rounded-2xl p-8 text-center shadow-sm ${detailsSection.visible ? "animate-fade-in-up-delay-3" : "opacity-0"}`}>
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-5">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-bold text-foreground text-lg mb-2">Admission</h3>
              <p className="text-emerald-600 font-bold text-2xl">FREE</p>
              <p className="text-muted-foreground mt-1 text-sm">Open to everyone</p>
              <p className="text-muted-foreground text-sm">Limited seating — RSVP required</p>
            </div>
          </div>

          {/* Map embed */}
          <div className={`mt-10 rounded-2xl overflow-hidden border border-border shadow-sm ${detailsSection.visible ? "animate-fade-in-up-delay-4" : "opacity-0"}`}>
            <iframe
              title="Event Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3295.6!2d-118.7815!3d34.2694!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80e8253e2b7e4e3f%3A0x1!2s1555+Simi+Town+Center+Way+%23640%2C+Simi+Valley%2C+CA+93065!5e0!3m2!1sen!2sus!4v1"
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>
      </section>

      {/* ── REGISTRATION ── */}
      <section ref={registrationRef} className="py-20 hero-gradient relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-10 left-10 w-80 h-80 rounded-full bg-white" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white" />
        </div>

        <div className="container relative z-10">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-amber-400 font-semibold tracking-widest uppercase text-sm mb-3">Limited Seating</p>
              <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
                Reserve Your Spot
              </h2>
              <hr className="gold-divider w-24 mx-auto mb-4" />
              <p className="text-white/70 text-lg">
                This is a FREE event — but seating is limited. Reserve your family's spot today!
              </p>
            </div>

              {/* ── GOOGLE FORM EMBED ── */}
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                <iframe
                  src="https://docs.google.com/forms/d/e/1FAIpQLSfLCJ2-TBQ7jUhQRLmtMZbvkZtDGw-U8z-TwcOe03oeqyHOEQ/viewform?embedded=true"
                  width="100%"
                  height="820"
                  frameBorder="0"
                  marginHeight={0}
                  marginWidth={0}
                  title="Event Registration Form"
                  className="block"
                >
                  Loading registration form…
                </iframe>
              </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-foreground text-white py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center">
                <HomeIcon className="w-4 h-4 text-white" />
                </div>
                <span className="font-bold text-white">CSMAR®</span>
              </div>
              <p className="text-white/60 text-sm leading-relaxed">
                Conejo Simi Moorpark Association of REALTORS®<br />
                Empowering first-time homebuyers since day one.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Event Details</h4>
              <div className="space-y-2 text-sm text-white/60">
                <p className="flex items-center gap-2"><Calendar className="w-4 h-4 text-amber-400" /> Saturday, April 25, 2026</p>
                <p className="flex items-center gap-2"><Clock className="w-4 h-4 text-amber-400" /> 11:00 AM – 1:30 PM</p>
                <p className="flex items-center gap-2"><MapPin className="w-4 h-4 text-amber-400" /> Simi Valley, CA 93065</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <div className="space-y-2 text-sm text-white/60">
                <button onClick={scrollToRegister} className="block hover:text-amber-400 transition-colors">Register Now</button>
                <a href="https://maps.google.com/?q=1555+Simi+Town+Center+Way+640+Simi+Valley+CA+93065" target="_blank" rel="noopener noreferrer" className="block hover:text-amber-400 transition-colors">Get Directions</a>
              </div>
            </div>
          </div>
          <hr className="border-white/10 mb-6" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
            <p>© 2026 Conejo Simi Moorpark Association of REALTORS®. All rights reserved.</p>
            <p>4th Annual Homebuyer Extravaganza · Home Buying 101</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
