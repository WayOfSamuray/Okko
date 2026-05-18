export const useShare = () => {
  const getShareLinks = () => {
    const url = window.location.href;
    const title = document.title;

    return {
      Телеграм: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      ВКонтакте: `https://vk.com/share.php?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      ОК: `https://connect.ok.ru/offer?url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`,
      Х: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      Фейсбук: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };
  };

  return { getShareLinks };
};
