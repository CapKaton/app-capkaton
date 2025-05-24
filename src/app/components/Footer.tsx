import { FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-zinc-700 pt-6 pb-8 px-4 text-center text-gray-400 text-sm">
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-2">
          <FaEnvelope className="text-lg" />
          <a
            href="mailto:contato@capkaton.com"
            className="hover:underline break-all"
          >
            contato@capkaton.com
          </a>
        </div>
        <div className="text-gray-500">
          © {new Date().getFullYear()} Capkaton. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
