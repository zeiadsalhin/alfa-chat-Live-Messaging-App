const Footer = ({t, i18n}) => {

  /* Toggle between English ⇄ Arabic */
    const toggleLang = () => {
      i18n.changeLanguage(i18n.language.includes('ar') ? 'en' : 'ar');
    };

  return (
    <footer
      className="
        w-full text-sm bg-zinc-900 border-t border-zinc-800 py-3 px-4 text-center
        text-zinc-300
      "
    >
      <div
        className="
          flex flex-col sm:flex-row justify-center sm:justify-between
          items-center gap-2 sm:gap-4 max-w-4xl mx-auto
        "
      >
        <p className="text-xs">
          &copy; {new Date().getFullYear()} Alfa Chat&nbsp;—&nbsp;v1.4
        </p>

        <div className="flex gap-4 text-xs">
          <a href="#" className="hover:underline hover:text-white transition">
            {t('footer.about')}
          </a>
          <a href="#" className="hover:underline hover:text-white transition">
            {t('footer.privacy')}
          </a>
          <a href="#" className="hover:underline hover:text-white transition">
            {t('footer.terms')}
          </a>

          {/* Language switcher */}
          <button
            onClick={toggleLang}
            className="font-stretch-extra-expanded hover:text-white transition"
          >
            {i18n.language.includes('ar') ? 'EN' : 'العربية'}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
