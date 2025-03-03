import Chat from './components/Chat';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      {/* Background image div */}
      <div 
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/background.jpg')" }}
      />
      
      {/* Overlay with blur effect */}
      <div 
        className="absolute inset-0 bg-black/30"
        style={{ 
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)" 
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        <Chat />
      </div>
    </main>
  );
}
