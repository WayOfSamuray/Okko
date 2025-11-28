import type { ChangeEvent, FormEvent, FC } from "react";
import style from "./SearchBar.module.css";

type Props = {
  query: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

const SearchBar: FC<Props> = ({ query, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className={style.searchForm}>
      <input
        type="text"
        value={query}
        placeholder="Введите название фильма"
        onChange={onChange}
        className={style.searchInput}
      />
      <button className={style.searchButton} type="submit">
        Искать
      </button>
    </form>
  );
};

export default SearchBar;
