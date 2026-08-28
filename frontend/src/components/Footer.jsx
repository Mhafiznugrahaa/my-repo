import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="border-t border-[#ececec] dark:border-white/10">
      <div className="container-wide py-16 sm:py-20">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <div className="text-center sm:text-left">
            <Link to="/" className="text-base font-extrabold tracking-tight text-[#111] dark:text-white">
              mhafiznugraha
            </Link>
            <p className="text-xs text-[#8a8a8a] dark:text-white/40 mt-2 max-w-[300px]">
              Personal portfolio & information hub. Built with React + Webman.
            </p>
          </div>
          <div className="flex gap-8">
            <Link to="/" className="text-xs text-[#8a8a8a] dark:text-white/40 font-medium hover:text-[#111] dark:hover:text-white motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out">Beranda</Link>
            <Link to="/informasi" className="text-xs text-[#8a8a8a] dark:text-white/40 font-medium hover:text-[#111] dark:hover:text-white motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out">Informasi</Link>
            <Link to="/portofolio" className="text-xs text-[#8a8a8a] dark:text-white/40 font-medium hover:text-[#111] dark:hover:text-white motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out">Portofolio</Link>
            <Link to="/tentang" className="text-xs text-[#8a8a8a] dark:text-white/40 font-medium hover:text-[#111] dark:hover:text-white motion-safe:transition-all motion-safe:duration-300 motion-safe:ease-out">Tentang</Link>
          </div>
        </div>
        <div className="border-t border-[#ececec] dark:border-white/10 mt-10 pt-6 text-center sm:text-left">
          <p className="text-[11px] text-[#8a8a8a] dark:text-white/40">&copy; {new Date().getFullYear()} mhafiznugraha. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
