"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Heart, Truck, Clock, TrendingUp, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TopRestaurantsDemo } from "./TopRestaurantsDemo";
import Link from "next/link";

const ORDER_STAGES = [
  { label: "PLACED", percentage: 0 },
  { label: "PREPARING", percentage: 33 },
  { label: "READY", percentage: 66 },
  { label: "DELIVERED", percentage: 100 },
];

export default function HeroSection() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage((prevStage) => {
        if (prevStage >= ORDER_STAGES.length - 1) {
          return 0;
        }
        return prevStage + 1;
      });
    }, 2000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-8 bg-gray-50/50">
      <div className="lg:container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          <Card className="lg:col-span-7 bg-[#0f0f0f] text-white border-white/10 border rounded-[32px] overflow-hidden relative min-h-[500px] flex flex-col justify-center p-8 md:p-12 shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-600/20 blur-[120px] rounded-full pointer-events-none mix-blend-screen" />

            <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-yellow-600/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

            <div className="relative z-10 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-orange-400 text-xs font-medium mb-6 animate-fade-in">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                </span>
                #1 Food Delivery Platform
              </div>

              <h1 className="text-4xl md:text-6xl xl:text-7xl font-medium leading-tight mb-6 tracking-tight">
                Craving? <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-orange-300 to-yellow-200">
                  We Deliver Joy.
                </span>
              </h1>

              <p className="text-gray-400 text-[16px] md:text-xl mb-10 max-w-lg">
                Experience the fastest delivery from top-rated restaurants.
                Fresh food, transparent pricing, and live tracking - all in one
                place.
              </p>

             <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
  <Link href="/login" className="w-full sm:w-auto">
    <Button
      size="lg"
      className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-6 sm:px-8 h-11 sm:h-14 text-base sm:text-lg font-medium shadow-[0_0_20px_rgba(234,88,12,0.3)] transition-all w-full cursor-pointer"
    >
      Login Now
    </Button>
  </Link>
  
  <Link href="/signup" className="w-full sm:w-auto">
    <Button
      size="lg"
      variant="outline"
      className="h-11 sm:h-14 rounded-full border-gray-700 bg-transparent hover:bg-white/5 hover:text-white px-6 sm:px-8 text-base sm:text-lg font-medium transition-all hover:border-orange-500/50 w-full cursor-pointer text-gray-300"
    >
      Create Account
    </Button>
  </Link>
</div>

              {/* Trust Indicators / Stats */}
              <div className="mt-12 flex items-center gap-6 pt-8 border-t border-white/10">
                <div>
                  <p className="md:text-3xl text-2xl font-bold text-white">10k+</p>
                  <p className="text-sm text-gray-500">Happy Users</p>
                </div>
                <div className="h-10 w-[1px] bg-white/10" />
                <div>
                  <p className="md:text-3xl text-2xl font-bold text-white">500+</p>
                  <p className="text-sm text-gray-500">Restaurants</p>
                </div>
                <div className="h-10 w-[1px] bg-white/10" />
                <div>
                  <p className="md:text-3xl text-2xl font-bold text-white"><span className="hidden sm:inline">⚡</span>Fast</p>
                  <p className="text-sm text-gray-500">Delivery</p>
                </div>
              </div>
            </div>
          </Card>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <Card className="bg-white border-none shadow-xl rounded-[32px] p-6 flex flex-col justify-between hover:shadow-2xl transition-shadow duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    Live Order Status
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Track your delivery in real-time
                  </p>
                </div>
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-2.5 rounded-full shadow-sm">
                  <Truck className="h-6 w-6 text-green-600" />
                </div>
              </div>

              {/* Restaurant Info */}
              <div className="flex items-center gap-4 mb-6 p-3 bg-gray-50 rounded-2xl">
                <div className="h-14 w-14 rounded-xl bg-gray-100 relative overflow-hidden ring-2 ring-gray-200">
                  <Image
                    src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=100"
                    alt="Restaurant"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-base">
                    Bella Italia Kitchen
                  </h4>
                  <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                    Order #FH-2847
                    <span className="text-orange-500">•</span>
                    <span className="text-green-600 font-medium">
                      {ORDER_STAGES[currentStage].label}
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner">
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-50 to-gray-100" />

                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-400 via-orange-500 to-orange-600 rounded-full transition-all duration-700 ease-in-out shadow-md"
                    style={{
                      width: `${ORDER_STAGES[currentStage].percentage}%`,
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-white/20 to-transparent" />
                  </div>

                  <div
                    className="absolute top-0 h-full w-1/3 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-[shimmer_2s_infinite]"
                    style={{
                      left: `${Math.max(0, ORDER_STAGES[currentStage].percentage - 33)}%`,
                    }}
                  />
                </div>

                <div className="flex justify-between items-center pt-2">
                  {ORDER_STAGES.map((stage, index) => (
                    <div
                      key={stage.label}
                      className="flex flex-col items-center gap-1 transition-all duration-300"
                    >
                      <div
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index <= currentStage
                            ? "bg-orange-500 shadow-lg shadow-orange-500/50 scale-125"
                            : "bg-gray-300"
                        }`}
                      />

                      <span
                        className={`text-[9px] font-bold tracking-wider uppercase transition-all duration-300 ${
                          index <= currentStage
                            ? "text-orange-600"
                            : "text-gray-400"
                        }`}
                      >
                        {stage.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-xs text-gray-500 font-medium">
                  Estimated Time
                </span>
                <span className="text-sm font-bold text-orange-600 flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" />
                  {currentStage === 0
                    ? "20 min"
                    : currentStage === 1
                      ? "15 min"
                      : currentStage === 2
                        ? "5 min"
                        : "Arrived!"}
                </span>
              </div>
            </Card>

            <Card className="bg-white border-none shadow-xl rounded-[32px] p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    Top Restaurants
                  </h3>
                  <p className="text-sm text-gray-500">Most ordered today</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-2.5 rounded-full shadow-sm">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
              </div>

              <TopRestaurantsDemo className="[mask-image:linear-gradient(to_bottom,transparent_0%,black_10%,black_90%,transparent_100%)]" />
            </Card>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(300%);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(2deg);
          }
        }
      `}</style>
    </section>
  );
}
