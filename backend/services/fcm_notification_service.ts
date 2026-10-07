import admin from 'firebase-admin';

// Initialize Firebase Admin SDK (Singleton)
if (!admin.apps.length) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)
    : undefined;

  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  } else {
    console.warn('[FCM] FIREBASE_SERVICE_ACCOUNT_JSON not set. Operating in mock notification mode.');
  }
}

export type OrderNotificationType =
  | 'ORDER_CONFIRMED'
  | 'PAYMENT_SUCCESS'
  | 'DISPATCHED'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED';

interface NotificationTemplate {
  titleEn: string;
  titleNe: string;
  bodyEn: string;
  bodyNe: string;
}

const ORDER_TEMPLATES: Record<OrderNotificationType, NotificationTemplate> = {
  ORDER_CONFIRMED: {
    titleEn: 'Order Confirmed! 🎉',
    titleNe: 'अर्डर स्वीकृत भयो! 🎉',
    bodyEn: 'Your order #{orderNumber} has been received and is being processed.',
    bodyNe: 'तपाईंको अर्डर #{orderNumber} विक्रेताबाट तयार गरिँदैछ।',
  },
  PAYMENT_SUCCESS: {
    titleEn: 'Payment Successful 💳',
    titleNe: 'भुक्तानी सफल भयो 💳',
    bodyEn: 'रु {amount} received via {gateway}. Thank you for shopping with Dhanshree!',
    bodyNe: '{gateway} मार्फत रु {amount} प्राप्त भयो। धन्यवाद!',
  },
  DISPATCHED: {
    titleEn: 'Order Dispatched 🚚',
    titleNe: 'सामान पठाइयो 🚚',
    bodyEn: 'Your parcel #{orderNumber} has left the seller warehouse.',
    bodyNe: 'तपाईंको सामान #{orderNumber} डेलिभरी हब तर्फ प्रस्थान गर्यो।',
  },
  OUT_FOR_DELIVERY: {
    titleEn: 'Out for Delivery Today! 📍',
    titleNe: 'आज घरदैलोमा पुग्दैछ! 📍',
    bodyEn: 'Rider is arriving at your tole soon with order #{orderNumber}.',
    bodyNe: 'डेलिभरी राइडर तपाईंको टोलमा सामान लिएर आउँदैछ।',
  },
  DELIVERED: {
    titleEn: 'Package Delivered! 🎁',
    titleNe: 'सामान डेलिभर भयो! 🎁',
    bodyEn: 'Order #{orderNumber} was delivered. Rate your purchase on Dhanshree!',
    bodyNe: 'अर्डर #{orderNumber} डेलिभर भयो। कृपया आफ्नो अनुभव सेयर गर्नुहोस्।',
  },
};

export class FcmNotificationService {
  /**
   * Dispatches high-priority transactional push notification to user device
   */
  public static async sendOrderPushNotification(params: {
    fcmToken: string;
    orderId: string;
    orderNumber: string;
    type: OrderNotificationType;
    amountNpr?: number;
    gateway?: string;
    language?: 'ne' | 'en';
  }): Promise<{ success: boolean; messageId?: string }> {
    const { fcmToken, orderId, orderNumber, type, amountNpr, gateway, language = 'ne' } = params;

    if (!admin.apps.length) {
      console.log(`[FCM MOCK] Push sent to token: ${fcmToken.substring(0, 15)}... | Type: ${type}`);
      return { success: true, messageId: `mock-msg-${Date.now()}` };
    }

    const template = ORDER_TEMPLATES[type];
    const isNepali = language === 'ne';

    let title = isNepali ? template.titleNe : template.titleEn;
    let body = isNepali ? template.bodyNe : template.bodyEn;

    // String interpolation
    body = body
      .replace('{orderNumber}', orderNumber)
      .replace('{amount}', amountNpr ? amountNpr.toString() : '')
      .replace('{gateway}', gateway || 'Wallet');

    const message: admin.messaging.Message = {
      token: fcmToken,
      notification: {
        title,
        body,
      },
      data: {
        orderId,
        orderNumber,
        type,
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
        targetRoute: `/orders/${orderId}`,
      },
      android: {
        priority: 'high',
        notification: {
          channelId: 'dhanshree_order_updates',
          sound: 'default',
          color: '#10B981', // Emerald Growth Green
          icon: 'ic_notification',
          defaultVibrateTimings: true,
        },
      },
      apns: {
        payload: {
          aps: {
            alert: { title, body },
            sound: 'default',
            badge: 1,
          },
        },
      },
    };

    try {
      const response = await admin.messaging().send(message);
      return { success: true, messageId: response };
    } catch (error: any) {
      console.error(`[FCM] Failed to dispatch push notification: ${error.message}`);
      return { success: false };
    }
  }
}
