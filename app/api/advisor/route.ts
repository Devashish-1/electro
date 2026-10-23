import { NextRequest, NextResponse } from 'next/server';
import { getProducts } from '@/lib/db';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const query = (body.query || '').toLowerCase();
    const hp = Number(body.hp || 0);
    const category = body.category || '';

    const allProducts = await getProducts();
    let recommendations: string[] = [];
    let matchedProducts: any[] = [];
    let technicalNotes: string[] = [];

    // Rule-based electrical intelligence combined with catalog matching
    if (query.includes('motor') || query.includes('hp') || hp > 0) {
      const motorHp = hp || (query.match(/(\d+)\s*(?:hp|horse\s*power)/i)?.[1] ? Number(query.match(/(\d+)\s*(?:hp|horse\s*power)/i)?.[1]) : 15);
      const flc = Math.round(motorHp * 1.4 * 10) / 10; // Full load current approx 1.4A per HP for 415V 3-phase AC motor

      let starterType = 'Direct-On-Line (DOL)';
      let cableSize = '2.5 sq mm copper / 4 sq mm aluminum';
      let mpcbRating = `${Math.ceil(flc * 1.1)}A - ${Math.ceil(flc * 1.25)}A`;

      if (motorHp > 7.5 && motorHp <= 25) {
        starterType = 'Automatic Star-Delta Starter (FAS)';
        cableSize = '6 sq mm - 10 sq mm 3-Core Copper';
      } else if (motorHp > 25) {
        starterType = 'Soft Starter or Variable Frequency Drive (VFD)';
        cableSize = '16 sq mm - 35 sq mm Armored Copper Cable';
      }

      recommendations.push(
        `For your ${motorHp} HP 3-Phase 415V Motor: Full Load Current (FLC) is approximately ${flc} Amperes.`,
        `Recommended Starter: ${starterType} with bimetallic overload relay set at ${flc}A.`,
        `Recommended Power Cable: Minimum ${cableSize} to restrict starting voltage drop below 3%.`
      );

      technicalNotes.push(
        'For high-inertia loads (Gangsaw, Stone crushers, Ball mills), use Class 20/30 heavy trip overload protection.',
        'Ensure vacuum varnish impregnated Class F or H insulation for maximum longevity against thermal cycling.'
      );

      matchedProducts = allProducts.filter(p =>
        p.category === 'motors-rewinding' ||
        p.category === 'panels-switchgear' ||
        p.name.toLowerCase().includes('motor') ||
        p.name.toLowerCase().includes('starter')
      ).slice(0, 4);
    } else if (query.includes('welding') || query.includes('electrode') || query.includes('rod') || query.includes('7018')) {
      recommendations.push(
        'Low-Hydrogen High Tensile Fabrication: Use Ador Super-6 E7018 or D&H 7018 for radiographic structural quality joints.',
        'General Sheet Metal & Pipeline Welding: Use D&H Supratherme or 6013 general-purpose rutile electrodes with smooth arc and minimal spatter.',
        'Important Practice: Low-hydrogen electrodes (E7018) require pre-heating at 250°C-300°C in an electrode drying oven for 1 hour before welding to eliminate hydrogen embrittlement.'
      );

      matchedProducts = allProducts.filter(p =>
        p.category === 'welding-solutions' ||
        p.name.toLowerCase().includes('welding') ||
        p.name.toLowerCase().includes('7018')
      ).slice(0, 4);
    } else if (query.includes('apfc') || query.includes('power factor') || query.includes('penalty') || query.includes('kvar')) {
      recommendations.push(
        'Maintain Power Factor between 0.98 and 0.99 Lagoon to qualify for DISCOM incentives and eliminate penalty charges completely.',
        'Use heavy-duty MPP cylindrical capacitors with overpressure disconnector and detuned harmonic reactors (7% or 14%) if non-linear VFD loads exceed 20%.',
        'DAGDI builds custom CRCA 14-gauge APFC panels with Entes / Momaya microprocessor relays featuring hunt-free automatic step switching.'
      );

      matchedProducts = allProducts.filter(p =>
        p.category === 'panels-switchgear' ||
        p.category === 'meters-instruments' ||
        p.name.toLowerCase().includes('apfc') ||
        p.name.toLowerCase().includes('relay')
      ).slice(0, 4);
    } else {
      recommendations.push(
        'DAGDI Electricals provides authorized industrial engineering stock and workshop rewinding services across Rajasthan.',
        'All custom switchboards and APFC panels undergo full dielectric high-voltage testing and megger insulation checks before dispatch.'
      );
      matchedProducts = allProducts.filter(p => p.featured).slice(0, 4);
    }

    return NextResponse.json({
      success: true,
      query: body.query,
      advice: {
        summary: recommendations[0] || 'Technical advice prepared by DAGDI engineering specialists.',
        recommendations,
        technicalNotes,
        matchedProducts,
        helpline: '+91 94142 81395 (Technical Director: Sandesh Dagdi Saini)',
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Error processing advisor query' },
      { status: 500 }
    );
  }
}
