import Link from "next/link";

export default function Component() {
  return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF6] relative overflow-hidden">
        {/* Decorative borders */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-0 top-0 w-48 h-full bg-contain bg-left opacity-20" />
          <div className="absolute right-0 top-0 w-48 h-full bg-contain bg-right opacity-20" />
        </div>

        <div className="max-w-md w-full mx-auto px-4 py-8 relative">
          {/* Top ornament */}
          {/*<div className="w-full h-12 mb-8 bg-[#C5A572] opacity-80 mask-image-[linear-gradient(to_right,transparent,black,transparent)] flex items-center justify-center">*/}
          {/*  <div className="w-64 h-1 bg-[#C5A572]" />*/}
          {/*</div>*/}

          {/* Navigation buttons */}
          <div className="space-y-4 w-full max-w-sm mx-auto">
            <Link href="/community" className="block">
              <button className="w-full py-6 text-lg font-semibold bg-[#C17F65] hover:bg-[#B57058] text-white rounded-full transition duration-200">
                COMMUNITY
              </button>
            </Link>

            <Link href="/crochet" className="block">
              <button className="w-full py-6 text-lg font-semibold bg-[#7797B7] hover:bg-[#6A89A8] text-white rounded-full transition duration-200">
                CROCHET
              </button>
            </Link>

            <Link href="/embroidery" className="block">
              <button className="w-full py-6 text-lg font-semibold bg-[#F5A9D3] hover:bg-[#E899C1] text-white rounded-full transition duration-200">
                EMBROIDERY
              </button>
            </Link>

            <Link href="/helper" className="block">
              <button className="w-full py-6 text-lg font-semibold bg-[#BEA99D] hover:bg-[#AD988C] text-white rounded-full transition duration-200">
                VIRTUAL HELPER
              </button>
            </Link>
          </div>

          {/* Bottom ornament */}
          {/*<div className="w-full h-12 mt-8 bg-[#C5A572] opacity-80 mask-image-[linear-gradient(to_right,transparent,black,transparent)] flex items-center justify-center">*/}
          {/*  <div className="w-64 h-1 bg-[#C5A572]" />*/}
          {/*</div>*/}
        </div>
      </div>
  );
}
