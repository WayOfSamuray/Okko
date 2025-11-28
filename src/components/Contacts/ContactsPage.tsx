import style from './Contacts.module.css'

const ContactsPage = () => {
  return (
    <section className={style.contacts}>
      <div className={style.container}>
        <h1 className={style.title}>Контакты</h1>
        <p className={style.subtitle}>
          Есть идеи, предложения или хочешь связаться по проекту? Напиши —
          будем на связи.
        </p>

        <div className={style.grid}>
          <div className={style.card}>
            <h2 className={style.cardTitle}>E-mail</h2>
            <p className={style.cardText}>
              По общим вопросам и сотрудничеству:
            </p>
            <a href="mailto:example@mail.com" className={style.link}>
              example@mail.com
            </a>
          </div>

          <div className={style.card}>
            <h2 className={style.cardTitle}>Соцсети</h2>
            <p className={style.cardText}>Следить за обновлениями проекта:</p>
            <ul className={style.list}>
              <li>
                <a href="#" className={style.link}>
                  VK — страница проекта
                </a>
              </li>
              <li>
                <a href="#" className={style.link}>
                  Telegram — новости и апдейты
                </a>
              </li>
              <li>
                <a href="#" className={style.link}>
                  YouTube — трейлеры и разборы
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactsPage;
