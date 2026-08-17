import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import { Zap, Fuel, Wind, Lightbulb, TreePine, Bike, Sun, Droplets, Recycle, ShoppingBag, Utensils, Plane } from 'lucide-react';

const tips = [
  {
    category: 'Electricity',
    icon: Zap,
    color: '#ffc107',
    items: [
      { icon: Lightbulb, title: 'Switch to LED Bulbs', desc: 'LED bulbs use up to 80% less energy than traditional incandescent bulbs and last 25 times longer.' },
      { icon: Sun, title: 'Use Natural Light', desc: 'Open curtains during daytime. Set your AC to 24°C instead of lower — every degree saves 6% energy.' },
      { icon: Zap, title: 'Unplug Idle Devices', desc: 'Standby power can account for 5–10% of your electricity bill. Unplug chargers and devices when not in use.' },
      { icon: Droplets, title: 'Energy-Efficient Appliances', desc: 'Choose appliances with 5-star energy ratings. They use 20–30% less electricity than lower-rated ones.' },
    ],
  },
  {
    category: 'Fuel',
    icon: Fuel,
    color: '#ff6d00',
    items: [
      { icon: Bike, title: 'Cycle for Short Trips', desc: 'For trips under 3km, cycling instead of driving saves roughly 0.7 kg of CO₂ per trip.' },
      { icon: Fuel, title: 'Maintain Tyre Pressure', desc: 'Under-inflated tyres increase fuel consumption by 3%. Check pressure monthly for optimal efficiency.' },
      { icon: TreePine, title: 'Carpool Regularly', desc: 'Sharing rides with just one other person cuts your per-person emissions in half for that journey.' },
      { icon: Wind, title: 'Smooth Driving Habits', desc: 'Avoid rapid acceleration and hard braking. Smooth driving can improve fuel efficiency by up to 30%.' },
    ],
  },
  {
    category: 'General',
    icon: Recycle,
    color: '#00e676',
    items: [
      { icon: Recycle, title: 'Reduce, Reuse, Recycle', desc: 'Recycling one ton of paper saves 17 trees and 4,100 KWh of electricity. Start sorting your waste today.' },
      { icon: ShoppingBag, title: 'Buy Less, Buy Better', desc: 'Fast fashion produces 10% of global CO₂ emissions. Choose quality over quantity and second-hand where possible.' },
      { icon: Utensils, title: 'Eat Less Meat', desc: 'Cutting beef 4 days a week can reduce your food carbon footprint by 30%. Try plant-based alternatives.' },
      { icon: Plane, title: 'Reconsider Flying', desc: 'One long-haul flight can emit as much CO₂ as 3 months of driving. Take trains or video-call instead when possible.' },
    ],
  },
];

const Tips = () => {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0f0d' }}>
      <Navbar />
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '32px 24px' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div style={{ textAlign: 'center', marginBottom: '40px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#e8f5e9', marginBottom: '10px' }}>
              Sustainability <span style={{ color: '#00e676' }}>Tips</span>
            </h1>
            <p style={{ color: '#a5d6a7', fontSize: '16px' }}>Small changes, big impact. Here's how you can reduce your carbon footprint.</p>
          </div>

          {tips.map(({ category, icon: CatIcon, color, items }, ci) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: ci * 0.15 }}
              style={{ marginBottom: '40px' }}
            >
              {/* Category Header */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px',
                paddingBottom: '14px', borderBottom: '1px solid rgba(0,230,118,0.08)',
              }}>
                <div style={{
                  width: 42, height: 42, borderRadius: '12px',
                  background: `rgba(${color === '#00e676' ? '0,230,118' : color === '#ff6d00' ? '255,109,0' : '255,193,7'}, 0.15)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <CatIcon size={22} color={color} />
                </div>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#e8f5e9' }}>{category}</h2>
              </div>

              {/* Tips Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                {items.map(({ icon: Icon, title, desc }, i) => (
                  <motion.div
                    key={title}
                    className="glass-card"
                    whileHover={{ y: -4, borderColor: `rgba(${color === '#00e676' ? '0,230,118' : color === '#ff6d00' ? '255,109,0' : '255,193,7'}, 0.3)` }}
                    initial={{ opacity: 0, scale: 0.97 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    style={{ padding: '24px', transition: 'all 0.3s ease', cursor: 'default' }}
                  >
                    <div style={{
                      width: 44, height: 44, borderRadius: '12px',
                      background: `rgba(${color === '#00e676' ? '0,230,118' : color === '#ff6d00' ? '255,109,0' : '255,193,7'}, 0.1)`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: '14px',
                    }}>
                      <Icon size={22} color={color} />
                    </div>
                    <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#e8f5e9', marginBottom: '8px' }}>{title}</h3>
                    <p style={{ fontSize: '13px', color: '#a5d6a7', lineHeight: 1.7, margin: 0 }}>{desc}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </main>
    </div>
  );
};

export default Tips;
