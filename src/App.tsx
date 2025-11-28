import { BrowserRouter, Route, Routes } from "react-router-dom"
import MainFile from "./components/MainContent/MainFile";
import AboutPage from "./components/About/AboutPage";
import ContactsPage from "./components/Contacts/ContactsPage";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PopularPage from "./components/Popular/PopularPage";

const App = () => {
  return (
    <BrowserRouter>
    <Header />
    <main>
      <Routes>
        <Route path="/" element={<MainFile />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/popular" element={<PopularPage />} />
      </Routes>
    </main>
    <Footer />
    </BrowserRouter>
  )
}

export default App;