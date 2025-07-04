const Footer = () => {
  return (
    <footer className="w-full text-sm text-zinc-300 bg-zinc-900 border-t border-zinc-800 py-3 px-4 text-center">
      <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-2 sm:gap-4 max-w-4xl mx-auto">
        <p className="text-xs">&copy; {new Date().getFullYear()} Alfa Chat - v1.3</p>
        <div className="flex gap-4 text-xs">
          <a href="#" className="hover:underline hover:text-white transition">About</a>
          <a href="#" className="hover:underline hover:text-white transition">Privacy</a>
          <a href="#" className="hover:underline hover:text-white transition">Terms</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
