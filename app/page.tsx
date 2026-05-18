import MainSlider from "./components/MainSlider/MainSlider";
import NewBlock from "./components/NewBlock/NewBlock";
import PopularBlock from "./components/NewBlock/PopularBlock/PopularBlock";
import TopRatedBlock from "./components/NewBlock/TopRatedBlock/TopRatedBlock";

export default function Home() {
  return (
    <>
      <MainSlider />
      <NewBlock />
      <PopularBlock />
      <TopRatedBlock />
    </>
  );
}

export const metadata = {
  title: "Главная страница Окко",
};
