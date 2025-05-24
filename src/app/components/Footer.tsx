import { FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-zinc-700 pt-6 pb-8 px-4 max-w-4xl mx-auto text-gray-300">
      <div className="flex items-center gap-2">
        <FaEnvelope className="text-xl text-gray-400" />
        <a
          href="mailto:inaciosilva.dev@gmail.com"
          className="hover:underline break-all"
        >
          inaciosilva.dev@gmail.com
        </a>
      </div>
    </footer>
  );
};

export default Footer;
