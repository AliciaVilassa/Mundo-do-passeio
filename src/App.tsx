import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { HowItWorks } from './components/HowItWorks';
import { PricingSection } from './components/PricingSection';
import { WalkersList } from './components/WalkersList';
import { WalkerProfileModal } from './components/WalkerProfileModal';
import { BecomeWalker } from './components/BecomeWalker';
import { BookingWizard } from './components/BookingWizard';
import { TutorProfileModal } from './components/TutorProfileModal';
import { DogQuestionnaireModal } from './components/DogQuestionnaireModal';
import { WelcomeChoiceModal } from './components/WelcomeChoiceModal';
import { PrivacyLGPDModal } from './components/PrivacyLGPDModal';
import { BottomNavBar, MobileTab } from './components/BottomNavBar';
import { Footer } from './components/Footer';
import { INITIAL_WALKERS } from './data/walkers';
import { DEFAULT_DOG_PROFILE } from './data/dogData';
import { Walker, BookingRecord, WalkerApplication, DogProfile } from './types';

export default function App() {
  const [walkers, setWalkers] = useState<Walker[]>(INITIAL_WALKERS);
  const [selectedWalkerForProfile, setSelectedWalkerForProfile] = useState<Walker | null>(null);

  // Modals state
  const [isWelcomeChoiceOpen, setIsWelcomeChoiceOpen] = useState(true);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [isBecomeWalkerOpen, setIsBecomeWalkerOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isDogQuestionnaireOpen, setIsDogQuestionnaireOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState<MobileTab>('inicio');

  // Master Dog Profile state (synced with the 8-section questionnaire)
  const [dogProfile, setDogProfile] = useState<DogProfile>(() => {
    try {
      const saved = localStorage.getItem('passeiopet_dog_profile_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return DEFAULT_DOG_PROFILE;
  });

  // Booking pre-configurations
  const [initialWalkerIdForBooking, setInitialWalkerIdForBooking] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string>(() => dogProfile.country || 'Brasil');
  const [selectedState, setSelectedState] = useState<string>(() => dogProfile.state || 'ES');

  const handleChangeLocation = (country: string, state: string) => {
    setSelectedCountry(country);
    setSelectedState(state);
  };
  const [initialScheduleSettings, setInitialScheduleSettings] = useState<{
    walksPerDay: number;
    selectedDays: string[];
    additionals: {
      secondDog: boolean;
      largeDog: boolean;
      soloWalk: boolean;
      sundayHoliday: boolean;
    };
  } | null>(null);

  // Persistent bookings list (seeded with the example from prompt: Thor, 2 passeios/dia, Seg/Qua/Sex)
  const [bookings, setBookings] = useState<BookingRecord[]>(() => {
    try {
      const saved = localStorage.getItem('passeiopet_bookings_v1');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    // Default initial demonstration booking matching prompt section 11
    return [
      {
        id: 'PET-782194',
        createdAt: new Date().toISOString(),
        dog: {
          name: 'Thor',
          photoUrl: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=300&q=80',
          age: 3,
          breed: 'Golden Retriever',
          size: 'Médio',
          gender: 'Macho',
          neutered: true,
          sociableDogs: 'Muito sociável',
          strangerReaction: 'Tranquilo',
          pullsLeash: 'Às vezes',
          fears: ['Trovões / Fogos'],
          specialBehaviorNote: 'Muito brincalhão e adora correr na grama.',
          hasRestrictions: false,
          hasAllergies: false,
          allergyDetails: '',
          specialCareInstructions: 'Oferecer água fresca na volta.',
          avoidActions: 'Não deixar comer restos de comida no chão.',
          pickupAddress: 'Rua Oscar Freire, 1200 - Jardins, São Paulo',
          referencePoint: 'Portão azul, interfone 42B',
          allowedLocations: ['Parque', 'Praça'],
          avoidLocations: 'Avenidas com trânsito pesado',
        },
        schedule: {
          walksPerDay: 2,
          selectedDays: ['Segunda-feira', 'Quarta-feira', 'Sexta-feira'],
          walkTimes: ['08:00', '18:00'],
          additionals: {
            secondDog: false,
            largeDog: false,
            soloWalk: false,
            sundayHoliday: false,
          },
          responsible: {
            fullName: 'Carlos Alberto Souza',
            phone: '(11) 99123-4567',
            email: 'carlos.souza@gmail.com',
            emergencyContact: 'Renata Souza - (11) 98765-4321',
            agreedToTerms: true,
          },
          selectedWalkerId: 'walker-mariana',
        },
        walker: INITIAL_WALKERS[0], // Mariana
        totalWalksWeekly: 6,
        basePriceWeekly: 150,
        additionalPriceWeekly: 0,
        totalPriceWeekly: 150,
        status: 'Confirmado',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem('passeiopet_bookings_v1', JSON.stringify(bookings));
    } catch {
      // ignore
    }
  }, [bookings]);

  // Open booking with default settings
  const handleOpenGeneralBooking = () => {
    setInitialWalkerIdForBooking(null);
    setInitialScheduleSettings(null);
    setIsBookingOpen(true);
  };

  // Open booking pre-selecting a specific walker
  const handleBookWithWalker = (walker: Walker) => {
    setInitialWalkerIdForBooking(walker.id);
    setIsBookingOpen(true);
  };

  // Open booking from the pricing calculator simulator
  const handleConfigureFromPricing = (params: {
    walksPerDay: number;
    selectedDays: string[];
    additionals: {
      secondDog: boolean;
      largeDog: boolean;
      soloWalk: boolean;
      sundayHoliday: boolean;
    };
  }) => {
    setInitialScheduleSettings(params);
    setIsBookingOpen(true);
  };

  // When a new booking is created in the wizard
  const handleBookingConfirmed = (newBooking: BookingRecord) => {
    setBookings((prev) => [newBooking, ...prev]);
  };

  // Cancel an existing booking
  const handleCancelBooking = (bookingId: string) => {
    if (confirm('Tem certeza de que deseja cancelar este agendamento semanal?')) {
      setBookings((prev) => prev.filter((b) => b.id !== bookingId));
    }
  };

  // Handle saving the full dog questionnaire
  const handleSaveDogProfile = (updatedDog: DogProfile) => {
    setDogProfile(updatedDog);
    try {
      localStorage.setItem('passeiopet_dog_profile_v1', JSON.stringify(updatedDog));
    } catch {
      // ignore
    }

    // Also update current bookings with the updated dog information
    setBookings((prev) =>
      prev.map((b) => ({
        ...b,
        dog: {
          ...b.dog,
          ...updatedDog,
        },
      }))
    );
  };

  // Mobile Bottom Navigation Tab Click Handler
  const handleMobileTabSelect = (tab: MobileTab) => {
    setActiveMobileTab(tab);
    if (tab === 'inicio') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (tab === 'agendar') {
      handleOpenGeneralBooking();
    } else if (tab === 'passeadores') {
      const el = document.getElementById('passeadores');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else if (tab === 'trabalhe') {
      setIsBecomeWalkerOpen(true);
    } else if (tab === 'perfil') {
      setIsProfileModalOpen(true);
    }
  };

  // When a walker application is submitted
  const handleWalkerSubmitted = (application: WalkerApplication) => {
    const dogSizes = application.dogSizesAccepted || ['Pequeno', 'Médio'];
    const newWalker: Walker = {
      id: `walker-${Date.now()}`,
      name: application.fullName || 'Novo Passeador',
      avatarUrl:
        application.photoUrl ||
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      country: application.country || selectedCountry || 'Brasil',
      state: application.state || selectedState || 'ES',
      city: application.city || 'Vitória',
      rating: 5.0,
      reviewsCount: 1,
      experienceYears: application.experienceDuration?.includes('5')
        ? 5
        : application.experienceDuration?.includes('3')
        ? 3
        : 2,
      tags: dogSizes.map((sz) => `✓ Cães ${sz.toLowerCase()}s`),
      pricePerWalk: 35,
      badge: application.status === 'Passeador aprovado' ? 'Passeador Verificado' : 'Cadastro em Análise',
      bio: application.aboutMe || 'Passeador parceiro dedicado ao bem-estar e alegria dos cães.',
      coverageArea: application.neighborhoodsServed || application.city || 'Vitória / Jardim da Penha',
      completedWalks: 15,
      availabilityDays: application.availableDays,
      dogSizesAccepted: dogSizes as any,
      walkTypes: application.acceptsMultipleDogs ? ['Individual', 'Em dupla'] : ['Individual exclusivo'],
      specialties: ['Reforço positivo', 'Atenção dedicada', 'Segurança animal'],
    };

    setWalkers((prev) => [newWalker, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAF7] text-[#111827] selection:bg-[#ECFDF5] selection:text-[#047857] font-['Plus_Jakarta_Sans',sans-serif] pb-20 md:pb-0">
      {/* Top Persistent Navigation */}
      <Navbar
        onOpenBooking={handleOpenGeneralBooking}
        onOpenBecomeWalker={() => setIsBecomeWalkerOpen(true)}
        onOpenMyAppointments={() => setIsProfileModalOpen(true)}
        onOpenDogQuestionnaire={() => setIsDogQuestionnaireOpen(true)}
        onOpenWelcomeChoice={() => setIsWelcomeChoiceOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        activeBookingsCount={bookings.length}
        dogName={dogProfile.name}
        selectedCountry={selectedCountry}
        selectedState={selectedState}
        onChangeLocation={handleChangeLocation}
      />

      {/* Main Page Sections */}
      <main className="flex-grow">
        {/* 1. Hero */}
        <Hero
          onOpenBooking={handleOpenGeneralBooking}
          onOpenBecomeWalker={() => setIsBecomeWalkerOpen(true)}
          onOpenDogQuestionnaire={() => setIsDogQuestionnaireOpen(true)}
          dogName={dogProfile.name}
        />

        {/* 2. Como Funciona */}
        <HowItWorks onStartBooking={handleOpenGeneralBooking} />

        {/* 3. Preços e Adicionais com Simulador */}
        <PricingSection onConfigureSchedule={handleConfigureFromPricing} />

        {/* 4. Lista e Cards dos Passeadores */}
        <WalkersList
          walkers={walkers}
          onViewProfile={(w) => setSelectedWalkerForProfile(w)}
          onSelectWalkerForBooking={handleBookWithWalker}
          selectedCountry={selectedCountry}
          selectedState={selectedState}
          onChangeLocation={handleChangeLocation}
          onOpenBecomeWalker={() => setIsBecomeWalkerOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer
        onOpenBooking={handleOpenGeneralBooking}
        onOpenBecomeWalker={() => setIsBecomeWalkerOpen(true)}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
      />

      {/* Floating LGPD & Privacy Badge (Art. 18) */}
      <button
        type="button"
        id="btn-floating-lgpd-privacidade"
        onClick={() => setIsPrivacyModalOpen(true)}
        className="fixed bottom-24 md:bottom-6 left-4 z-40 px-3.5 py-2 rounded-full bg-stone-900/95 hover:bg-stone-900 text-white text-xs font-bold shadow-lg hover:shadow-xl border border-stone-700/80 backdrop-blur-sm flex items-center gap-2 cursor-pointer transition-all hover:scale-105 group"
        title="Central de Privacidade & Direitos do Titular (Art. 18 LGPD)"
      >
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span className="text-emerald-400 font-black">LGPD</span>
        <span className="hidden sm:inline text-stone-300 group-hover:text-white transition-colors">
          | Privacidade & Direitos
        </span>
      </button>

      {/* Mobile Bottom Navigation Bar (5 Abas ergonômicas) */}
      <BottomNavBar
        activeTab={activeMobileTab}
        onTabSelect={handleMobileTabSelect}
        activeBookingsCount={bookings.length}
      />

      {/* Modals */}
      {/* Walker Detailed Profile Modal */}
      <WalkerProfileModal
        walker={selectedWalkerForProfile}
        onClose={() => setSelectedWalkerForProfile(null)}
        onSelectWalkerForBooking={handleBookWithWalker}
      />

      {/* "Seja um passeador" Registration Modal */}
      <BecomeWalker
        isOpen={isBecomeWalkerOpen}
        onClose={() => setIsBecomeWalkerOpen(false)}
        onWalkerSubmitted={handleWalkerSubmitted}
        onAddWalkerToPlatform={(w) => setWalkers((prev) => [w, ...prev])}
      />

      {/* Full Booking Scheduling Wizard (Etapas 1 a 10) */}
      <BookingWizard
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        walkers={walkers}
        initialWalkerId={initialWalkerIdForBooking}
        initialScheduleSettings={initialScheduleSettings}
        initialDog={dogProfile}
        onBookingConfirmed={handleBookingConfirmed}
      />

      {/* Tutor Profile & Appointments Modal (3 Abas: Agendamentos, Meu Pet, Minha Conta) */}
      <TutorProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        bookings={bookings}
        onCancelBooking={handleCancelBooking}
        onNewBookingClick={handleOpenGeneralBooking}
        dog={dogProfile}
        onEditDog={() => {
          setIsProfileModalOpen(false);
          setIsDogQuestionnaireOpen(true);
        }}
      />

      {/* 🐶 Full 8-Section Dog Questionnaire Modal */}
      <DogQuestionnaireModal
        isOpen={isDogQuestionnaireOpen}
        onClose={() => setIsDogQuestionnaireOpen(false)}
        initialDog={dogProfile}
        onSaveDog={handleSaveDogProfile}
        onSelectLocation={handleChangeLocation}
      />

      {/* 🚀 First-Screen Choice Gate: Quer ser passeador ou quer cadastrar o cachorro? */}
      <WelcomeChoiceModal
        isOpen={isWelcomeChoiceOpen}
        onClose={() => setIsWelcomeChoiceOpen(false)}
        onChooseDogQuestionnaire={() => {
          setIsDogQuestionnaireOpen(true);
        }}
        onChooseBecomeWalker={() => {
          setIsBecomeWalkerOpen(true);
        }}
      />

      {/* 🛡️ Central de Privacidade & Copiloto LGPD (Art. 18) */}
      <PrivacyLGPDModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
        dogProfile={dogProfile}
        onUpdateDogProfile={handleSaveDogProfile}
      />
    </div>
  );
}
