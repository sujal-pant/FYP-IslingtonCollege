// app/page.tsx (Home or Public Page)
"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Poppins } from 'next/font/google';
import { cn } from "@/utils/utils";
import { Button } from '@/components/ui/button';

const font = Poppins({ subsets: ["latin"], weight: ["600"] });

export default function HomePage() {
    const router = useRouter();

    return (
        <main className="relative h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 z-0"></div>

            <div className="relative z-10 text-center p-8 rounded-3xl shadow-xl bg-white/90 backdrop-blur-sm border border-gray-100 max-w-2xl">  {/* Increased max-w */}
                <div className="mb-6">
                    <Image
                        src="/logo.png" 
                        alt="SketchSphere Logo"
                        width={120} 
                        height={120}
                        className="mx-auto rounded-full shadow-md"
                        priority  
                    />
                </div>

                
                <h1 className={cn("text-5xl font-bold text-gray-800 mb-4", font.className)}>
                    SketchSphere
                </h1>

                
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                    A collaborative canvas for your ideas.
                </p>

              
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> 
                    <div>
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Real-time Collaboration</h3>
                        <p className="text-gray-700">Work together on boards in real-time with your team.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Intuitive Interface</h3>
                        <p className="text-gray-700">Easy-to-use tools make brainstorming and planning a breeze.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Flexible Boards</h3>
                        <p className="text-gray-700">Customize your boards to fit any project or workflow.</p>
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-blue-600 mb-2">Secure and Reliable</h3>
                        <p className="text-gray-700">Your data is safe and always accessible.</p>
                    </div>
                </div>

                
                <Button
                    onClick={() => router.push('/auth')}
                    className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-blue-500 hover:to-green-400 text-white font-medium py-3 px-8 rounded-xl shadow-md transition-colors duration-300"  // More vibrant button
                >
                    Join Now - It's Free!
                </Button>
            </div>
        </main>
    );
}