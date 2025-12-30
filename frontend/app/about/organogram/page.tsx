import Image from "next/image";

export default function OrganogramPage() {
    return (
        <div className="w-full min-h-screen bg-linear-to-b from-blue-50 to-white">
            <div className="max-w-7xl mx-auto px-4 py-12">
                {/* Page Header */}
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-bold text-teal-800 mb-4 text-center">
                        ORGANOGRAM OF THE MINISTRY
                    </h1>
                    <div className="w-32 h-1.5 bg-green-600 mx-auto"></div>
                </div>

                {/* Organogram Image Container */}
                <div className="bg-white rounded-2xl shadow-2xl p-8 flex justify-center items-center">
                    <div className="w-full max-w-6xl">
                        <Image
                            src="/images/organogram.png"
                            alt="Ministry Organogram"
                            width={1000}
                            height={600}
                            className="w-full h-auto rounded-lg"
                            priority
                        />
                    </div>
                </div>

                {/* Footer Note */}
                <div className="mt-8 text-center">
                    <p className="text-gray-600 text-sm">
                        Last Updated: {new Date().toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric'
                        })}
                    </p>
                </div>
            </div>
        </div>
    );
}