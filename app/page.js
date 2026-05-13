import Image from "next/image";


export default function Home() {
  return (
    <>
      <div className="flex justify-center flex-col items-center gap-6 text-white min-h-[60vh] px-4">
        <div className="font-bold flex items-center justify-center gap-4 text-4xl md:text-6xl text-center">
          Buy me a Chai
          <span>
            <Image src="/chaip.gif" width={60} height={60} style={{ height: 'auto' }} alt="Chai animation" unoptimized />
          </span>
        </div>
        <p className="text-center max-w-2xl text-lg opacity-80">
          A decentralized application (dApp) built on the Ethereum blockchain that allows users to create and manage their own tea shops.
        </p>
        <div className="flex gap-4">
          <button className="text-white bg-gradient-to-br from-purple-600 to-blue-700 hover:bg-gradient-to-bl focus:ring-4 font-medium rounded-lg text-sm px-8 py-3 transition-all duration-300 transform hover:scale-105">
            Start Now
          </button>
          <button className="text-white border border-slate-700 bg-slate-900/50 hover:bg-slate-800 font-medium rounded-lg text-sm px-8 py-3 transition-all">
            Read More
          </button>
        </div>
      </div>

      <div className="bg-white h-1 opacity-10">
      </div>

      <div className="text-white container mx-auto py-32">
        <h2 className="text-2xl font-bold text-center my-2">How it works</h2>



        <div className="flex flex-col md:flex-row items-start justify-center gap-16 py-16 px-6 bg-navy ">


          <div className="item space-y-4 flex flex-col items-center max-w-[280px]">
            <div className="bg-white rounded-full p-1 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <img className="rounded-full" width={88} height={88} src="/girly.gif" alt="Funding" />
            </div>
            <h3 className="font-bold text-ghostWhite text-xl">Monthly Support</h3>
            <p className="text-center text-slate-400 leading-relaxed">
              Turn your tea shop passion into a sustainable career with <span className="text-electric font-semibold">reliable monthly income</span> from your biggest fans.
            </p>
          </div>

          <div className="item space-y-4 flex flex-col items-center max-w-[280px]">
            <div className="bg-white rounded-full p-1 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <img className="rounded-full" width={88} height={88} src="/coin.gif" alt="Blockchain" />
            </div>
            <h3 className="font-bold text-ghostWhite text-xl">Ownership on Chain</h3>
            <p className="text-center text-slate-400 leading-relaxed">
              Launch your <span className="text-electric font-semibold">decentralized shop</span> on Ethereum. No middlemen—just you, your tea, and your community.
            </p>
          </div>


          <div className="item space-y-4 flex flex-col items-center max-w-[280px]">
            <div className="bg-white rounded-full p-1 shadow-[0_0_20px_rgba(59,130,246,0.2)]">
              <img className="rounded-full" width={88} height={88} src="/people1.gif" alt="Community" />
            </div>
            <h3 className="font-bold text-ghostWhite text-xl">Direct Connection</h3>
            <p className="text-center text-slate-400 leading-relaxed">
              Engage with a global community of <span className="text-electric font-semibold">tea enthusiasts</span> who value your craft and want to see you grow.
            </p>
          </div>
        </div>
      </div>
      <div className="bg-white h-1 opacity-10">
      </div>

      <div className="text-white container mx-auto pb-32 pt-32 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-center mb-14">Learn More about Us</h2>
        <div className="w-full max-w-2xl px-4">
          <iframe
            className="w-full aspect-video rounded-xl shadow-lg"
            src="https://www.youtube.com/embed/cm_sAq0mMwA"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen>
          </iframe>
        </div>
      </div>
    </>
  );
}
