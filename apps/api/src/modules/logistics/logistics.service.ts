import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import {
  CountryCode,
  CurrencyCode,
  CourierServiceabilityRequest,
  CourierServiceabilityResult,
  CrossBorderDutyRequest,
  CrossBorderDutyResult,
  CarrierTrackingWebhookPayload,
  OrderStatus,
} from '@dhanshree/shared';

@Injectable()
export class LogisticsService {
  private readonly logger = new Logger(LogisticsService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check local courier serviceability, transit times, and COD availability
   */
  checkServiceability(req: CourierServiceabilityRequest): CourierServiceabilityResult {
    const isNepal = req.countryCode === CountryCode.NEPAL;
    const isIndia = req.countryCode === CountryCode.INDIA;

    const carrierName = isNepal
      ? 'Nepal CanShip & Express Logistics'
      : isIndia
      ? 'Delhivery Surface Express'
      : 'Aramex Priority UAE';

    const currency = isNepal ? CurrencyCode.NPR : isIndia ? CurrencyCode.INR : CurrencyCode.AED;

    // Delivery time heuristics
    let transitTimeDays = '2-3 Business Days';
    let baseShippingFee = isNepal ? 150 : isIndia ? 99 : 25;

    // Weight increment (e.g. +$1/kg over 1kg)
    if (req.weightKg > 1) {
      const extraWeight = Math.ceil(req.weightKg - 1);
      baseShippingFee += extraWeight * (isNepal ? 50 : isIndia ? 40 : 10);
    }

    const estDate = new Date();
    estDate.setDate(estDate.getDate() + 3);

    return {
      isServiceable: true,
      carrierName,
      transitTimeDays,
      estimatedDeliveryDate: estDate.toLocaleDateString(),
      shippingFee: baseShippingFee,
      codAvailable: true,
      currency,
    };
  }

  /**
   * Cross-Border Customs Duty & Import Tax Estimator
   * Incorporates Nepal-India Treaty of Trade and India-UAE CEPA bilateral rules.
   */
  estimateCrossBorderDuty(req: CrossBorderDutyRequest): CrossBorderDutyResult {
    // Restricted item checks
    const catLower = req.category.toLowerCase();
    if (catLower.includes('gold bullion') || catLower.includes('hazardous') || catLower.includes('weapon')) {
      return {
        isAllowed: false,
        hsCode: '9999.99',
        customsDutyPercent: 0,
        customsDutyAmount: 0,
        importVatGstPercent: 0,
        importVatGstAmount: 0,
        carrierClearanceFee: 0,
        totalLandedCost: req.declaredValue,
        currency: req.currency,
        notes: 'RESTRICTED ITEM: Cross-border commercial shipping prohibited without government trade license',
      };
    }

    // Trade Agreement concessions
    let dutyPercent = 10.0;
    let importTaxPercent = req.destinationCountry === CountryCode.NEPAL ? 13.0 : req.destinationCountry === CountryCode.INDIA ? 18.0 : 5.0;
    let agreementNote = 'Standard WTO MFN tariff rate applied';

    // India <-> UAE CEPA (Comprehensive Economic Partnership Agreement)
    if (
      (req.originCountry === CountryCode.INDIA && req.destinationCountry === CountryCode.UAE) ||
      (req.originCountry === CountryCode.UAE && req.destinationCountry === CountryCode.INDIA)
    ) {
      dutyPercent = 5.0; // Concessional rate under India-UAE CEPA
      agreementNote = 'Preferential Tariff applied under India-UAE CEPA Framework';
    }

    // Nepal <-> India Treaty of Trade
    if (
      (req.originCountry === CountryCode.NEPAL && req.destinationCountry === CountryCode.INDIA) ||
      (req.originCountry === CountryCode.INDIA && req.destinationCountry === CountryCode.NEPAL)
    ) {
      dutyPercent = 6.0; // Preferential duty for SAARC / Bilateral treaty
      agreementNote = 'Preferential Tariff applied under Nepal-India Bilateral Treaty of Trade';
    }

    // HS Code determination
    let hsCode = '8518.30.00'; // Default headphones/audio
    if (catLower.includes('laptop') || catLower.includes('computer')) {
      hsCode = '8471.30.10';
      dutyPercent = 0.0; // IT Agreement ITA-1 zero duty
      agreementNote = 'Zero customs duty under WTO Information Technology Agreement (ITA-1)';
    } else if (catLower.includes('tea') || catLower.includes('agriculture')) {
      hsCode = '0902.40.20';
    } else if (catLower.includes('perfume') || catLower.includes('fragrance')) {
      hsCode = '3303.00.10';
      dutyPercent = 12.5;
    }

    const customsDutyAmount = Math.round(req.declaredValue * (dutyPercent / 100));
    const importTaxAmount = Math.round((req.declaredValue + customsDutyAmount) * (importTaxPercent / 100));
    const carrierClearanceFee = req.destinationCountry === CountryCode.UAE ? 35 : req.destinationCountry === CountryCode.INDIA ? 500 : 800;

    const totalLandedCost = req.declaredValue + customsDutyAmount + importTaxAmount + carrierClearanceFee;

    return {
      isAllowed: true,
      hsCode,
      customsDutyPercent: dutyPercent,
      customsDutyAmount,
      importVatGstPercent: importTaxPercent,
      importVatGstAmount: importTaxAmount,
      carrierClearanceFee,
      totalLandedCost,
      currency: req.currency,
      notes: `${agreementNote}. Import taxes assessed on CIF valuation.`,
    };
  }

  /**
   * Carrier Tracking Webhook Processor
   */
  handleCarrierWebhook(payload: CarrierTrackingWebhookPayload): { success: boolean; newStatus: string } {
    this.logger.log(
      `[CARRIER WEBHOOK] ${payload.carrier} reports ${payload.awbNumber} -> ${payload.event} at ${payload.eventLocation}`,
    );

    let mappedOrderStatus: OrderStatus;
    switch (payload.event) {
      case 'PICKED_UP':
        mappedOrderStatus = OrderStatus.HANDED_OVER_TO_COURIER;
        break;
      case 'IN_TRANSIT_HUB':
        mappedOrderStatus = OrderStatus.IN_TRANSIT;
        break;
      case 'OUT_FOR_DELIVERY':
        mappedOrderStatus = OrderStatus.OUT_FOR_DELIVERY;
        break;
      case 'DELIVERED':
        mappedOrderStatus = OrderStatus.DELIVERED;
        this.logger.log(`Order ${payload.orderNumber} delivered. Starting 7-day escrow satisfaction window.`);
        break;
      case 'DELIVERY_FAILED':
        mappedOrderStatus = OrderStatus.DELIVERY_FAILED;
        break;
      case 'RTO_INITIATED':
        mappedOrderStatus = OrderStatus.RTO_INITIATED;
        this.logger.warn(`Order ${payload.orderNumber} flagged as RTO by carrier ${payload.carrier}. Return transit initiated.`);
        break;
      default:
        mappedOrderStatus = OrderStatus.IN_TRANSIT;
    }

    return {
      success: true,
      newStatus: mappedOrderStatus,
    };
  }
}
