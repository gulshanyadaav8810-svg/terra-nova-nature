import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { LanguageProvider } from '@/context/LanguageContext';
import FloatingLanguageBtn from '@/components/FloatingLanguageBtn';

export const metadata = {
  title: 'Nature1 — Wildlife Expeditions, Nature Journals & Wilderness Academy',
  description: 'Immersive nature and wildlife expedition journals, apex predator tracking, forest ecology, marine biology, and professional wilderness field courses.',
  keywords: 'wildlife photography, nature expeditions, animal tracking, forest ecology, ocean reefs, snow leopard, bengal tiger, nature1',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <Navbar />
          {children}
          <Footer />
          <FloatingLanguageBtn />
        </LanguageProvider>
      </body>
    </html>
  );
}

