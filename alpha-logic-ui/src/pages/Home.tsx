import { Hero } from '../components/Hero';
import { NavBar } from '../components/NavBar';
import { MarqueeTicker } from '../components/MarqueeTicker';
import { PerformanceVisualizer } from '../components/PerformanceVisualizer';
import { FeatureLogic } from '../components/FeatureLogic';
import { AlphaArchives } from '../components/AlphaArchives';
import { TheStrategist } from '../components/TheStrategist';
import { AlphaEdge } from '../components/AlphaEdge';
import { Protocol } from '../components/Protocol';
import { WealthProjection } from '../components/WealthProjection';
import { Vault } from '../components/Vault';
import { KnowledgeBase } from '../components/KnowledgeBase';
import { SmallcaseGateway } from '../components/SmallcaseGateway';
import { Footer } from '../components/Footer';

export function Home() {
    return (
        <>
            <NavBar />
            <main className="relative z-10 w-full bg-brand-ivory text-brand-obsidian selection:bg-brand-gold selection:text-brand-obsidian">
                <Hero />
                <MarqueeTicker />
                <PerformanceVisualizer />
                <FeatureLogic />
                <AlphaArchives />
                <TheStrategist />
                <AlphaEdge />
                <Protocol />
                <WealthProjection />
                <Vault />
                <KnowledgeBase />
                <SmallcaseGateway />
                <Footer />
            </main>
        </>
    );
}
