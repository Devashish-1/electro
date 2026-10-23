import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const loadVal = Number(body.load || 100);
    const loadUnit = body.loadUnit === 'kVA' ? 'kVA' : 'kW';
    const currentPf = Math.max(0.4, Math.min(0.95, Number(body.currentPf || 0.75)));
    const targetPf = Math.max(currentPf + 0.02, Math.min(0.999, Number(body.targetPf || 0.98)));
    const monthlyUnits = Number(body.monthlyUnits || loadVal * 8 * 26); // default 8 hrs x 26 days
    const unitRate = Number(body.unitRate || 8.5); // INR per unit average industrial tariff

    // kW calculation
    const kW = loadUnit === 'kVA' ? loadVal * currentPf : loadVal;

    // Trigonometric power factor correction formula: kVAR = kW * (tan(acos(PF1)) - tan(acos(PF2)))
    const phi1 = Math.acos(currentPf);
    const phi2 = Math.acos(targetPf);
    const tanPhi1 = Math.tan(phi1);
    const tanPhi2 = Math.tan(phi2);

    const netKvar = kW * (tanPhi1 - tanPhi2);
    // 10% safety margin for industrial harmonic derating & ambient temperature
    const recommendedKvar = Math.ceil(netKvar * 1.1);

    // Capacitor Bank Stepping Configuration
    let steps: { step: number; kVAR: number; type: string }[] = [];
    if (recommendedKvar <= 30) {
      steps = [
        { step: 1, kVAR: 5, type: 'Heavy Duty MPP Cylindrical' },
        { step: 2, kVAR: 5, type: 'Heavy Duty MPP Cylindrical' },
        { step: 3, kVAR: 10, type: 'Heavy Duty MPP Cylindrical' },
        { step: 4, kVAR: 10, type: 'Heavy Duty MPP Cylindrical' },
      ];
    } else if (recommendedKvar <= 75) {
      steps = [
        { step: 1, kVAR: 5, type: 'Heavy Duty MPP Cylindrical' },
        { step: 2, kVAR: 10, type: 'Heavy Duty MPP Cylindrical' },
        { step: 3, kVAR: 15, type: 'Heavy Duty MPP Cylindrical' },
        { step: 4, kVAR: 25, type: 'Heavy Duty MPP Cylindrical' },
      ];
    } else if (recommendedKvar <= 150) {
      steps = [
        { step: 1, kVAR: 10, type: 'Heavy Duty MPP Cylindrical' },
        { step: 2, kVAR: 15, type: 'Heavy Duty MPP Cylindrical' },
        { step: 3, kVAR: 25, type: 'Heavy Duty MPP Cylindrical' },
        { step: 4, kVAR: 25, type: 'Heavy Duty MPP Cylindrical' },
        { step: 5, kVAR: 50, type: 'Heavy Duty MPP Cylindrical' },
      ];
    } else {
      const num50s = Math.floor(recommendedKvar / 50);
      steps.push({ step: 1, kVAR: 25, type: 'Heavy Duty MPP Cylindrical' });
      for (let i = 0; i < num50s; i++) {
        steps.push({ step: i + 2, kVAR: 50, type: 'Heavy Duty MPP Cylindrical' });
      }
    }

    // Financial Analysis (DISCOM PF Low Penalty Avoidance + High PF Rebate)
    // Low PF penalty is roughly 2% of total bill for every 0.01 drop below 0.90
    const penaltyRate = currentPf < 0.90 ? (0.90 - currentPf) * 100 * 0.015 : 0;
    const estimatedMonthlyBill = monthlyUnits * unitRate;
    const monthlyPenaltySaved = Math.round(estimatedMonthlyBill * penaltyRate);

    // High PF incentive (approx 0.5% rebate above 0.95)
    const incentiveRate = targetPf >= 0.95 ? (targetPf - 0.95) * 100 * 0.005 : 0;
    const monthlyRebateEarned = Math.round(estimatedMonthlyBill * incentiveRate);

    // kVA demand reduction: Apparent power reduction = kW/PF1 - kW/PF2
    const currentKva = kW / currentPf;
    const targetKva = kW / targetPf;
    const kvaReduction = Math.round((currentKva - targetKva) * 10) / 10;
    const monthlyDemandSaving = Math.round(kvaReduction * 280); // approx ₹280/kVA demand charge

    const totalMonthlyBenefit = monthlyPenaltySaved + monthlyRebateEarned + monthlyDemandSaving;
    const annualBenefit = totalMonthlyBenefit * 12;

    // Panel Cost and Payback ROI
    const estimatedPanelCost = Math.round(recommendedKvar * 850 + 25000); // approx ₹850/kVAR + switchgear/controller
    const paybackMonths = totalMonthlyBenefit > 0 ? (estimatedPanelCost / totalMonthlyBenefit).toFixed(1) : '3 - 6';

    return NextResponse.json({
      success: true,
      calculation: {
        kW: Math.round(kW * 10) / 10,
        currentPf,
        targetPf,
        netKvarRequired: Math.round(netKvar * 10) / 10,
        recommendedKvar,
        steps,
        currentKva: Math.round(currentKva * 10) / 10,
        targetKva: Math.round(targetKva * 10) / 10,
        kvaReduction,
        controllerRecommendation: recommendedKvar > 100 ? '12-Stage Microprocessor Intelligent APFC Relay' : '8-Stage Entes / Momaya Microprocessor Controller',
        suggestedPanelModel: `DAGDI APFC-${recommendedKvar}KVAR-${steps.length}STG-CRCA`,
        financials: {
          monthlyPenaltySaved,
          monthlyRebateEarned,
          monthlyDemandSaving,
          totalMonthlyBenefit,
          annualBenefit,
          estimatedPanelCost,
          paybackMonths: `${paybackMonths} months`,
        }
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Calculation error' },
      { status: 500 }
    );
  }
}
