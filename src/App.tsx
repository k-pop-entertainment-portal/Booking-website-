import Header from "./components/Header";
import NewsTicker from "./components/NewsTicker";
import Directory from "./components/Directory";
import InquiryForm from "./components/InquiryForm";
import Groups from "./components/Groups";
import LiveNews from "./components/LiveNews";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div id="top" dir="ltr" className="relative min-h-screen font-body">
      <Header />
      <NewsTicker />

      {/* Main layout — directory matrix + request form */}
      <main className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-6 px-4 pt-6 lg:grid-cols-[7fr_5fr] lg:gap-8 lg:pt-8">
        <Directory />
        <InquiryForm />
      </main>

      <Groups />
      <LiveNews />
      <Footer />
    </div>
  );
}
