import mqtt from 'mqtt';
import type { MqttClient } from 'mqtt';
import { MQTT_CONFIG } from '@/lib/constants';
import { ref, onUnmounted } from 'vue';

export interface MqttMessage {
  topic: string;
  payload: unknown;
  timestamp: number;
}
export type MessageHandler = (message: MqttMessage) => void;


class MqttService {
  private connectionListeners: ((connected: boolean) => void)[] = [];
  private client: MqttClient | null = null;
  private handlers = new Map<string, MessageHandler[]>();
  private reconnectAttempts = 0;
  private readonly maxReconnectAttempts = 5;

  isConnected() {
    return this.client?.connected || false;
  }
  connect(userId?: string): Promise<void> {
    if (this.isConnected()) return Promise.resolve();

    return new Promise((resolve, reject) => {
      try {
        const clientId = `chasqui_${userId || 'anon'}_${Date.now()}`;

        this.client = mqtt.connect(
          `ws://${MQTT_CONFIG.host}:${MQTT_CONFIG.port}/mqtt`,
          {
            clientId,
            clean: true,
            reconnectPeriod: 1_000,
            connectTimeout: 30_000,
          },
        );

        this.client.on('connect', () => {
          console.log('MQTT conectado');
          this.reconnectAttempts = 0;
          this.connectionListeners.forEach(fn => fn(true));
          resolve();
        });

        this.client.on('error', err => {
          console.error('Error MQTT:', err);
          reject(err);
        });

        this.client.on('close', () => {
          this.connectionListeners.forEach(fn => fn(false));
        });

        this.client.on('offline', () => {
          console.warn('MQTT offline');
          this.connectionListeners.forEach(fn => fn(false));
        });

        this.client.on('reconnect', () => {
          this.reconnectAttempts++;
          console.log(`MQTT reintentando… intento ${this.reconnectAttempts}`);
          if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            this.client?.end();
          }
        });

        this.client.on('message', (topic, message) => {
          try {
            const parsed = JSON.parse(message.toString());
            const mqttMessage: MqttMessage = {
              topic,
              payload: parsed,
              timestamp: Date.now(),
            };
            this.handlers.get(topic)?.forEach(h => h(mqttMessage));
          } catch (err) {
            console.error('Error al parsear mensaje MQTT:', err);
          }
        });
      } catch (err) {
        reject(err);
      }
    });
  }


  subscribe(topic: string, handler: MessageHandler) {
    if (!this.isConnected()) throw new Error('MQTT client not connected');

    this.client!.subscribe(topic, err => {
      if (err) console.error(`Error al suscribirse a ${topic}:`, err);
      else     console.log(`Subscrito a ${topic}`);
    });

    const list = this.handlers.get(topic) ?? [];
    this.handlers.set(topic, [...list, handler]);
  }

  unsubscribe(topic: string, handler?: MessageHandler) {
    if (!this.client) return;

    if (handler) {
      const remaining = (this.handlers.get(topic) ?? []).filter(h => h !== handler);
      if (remaining.length) {
        this.handlers.set(topic, remaining);
      } else {
        this.client.unsubscribe(topic);
        this.handlers.delete(topic);
      }
    } else {
      this.client.unsubscribe(topic);
      this.handlers.delete(topic);
    }
  }

  publish(topic: string, payload: unknown, opts?: { retain?: boolean }) {
    if (!this.isConnected()) throw new Error('MQTT client not connected');
    this.client!.publish(topic, JSON.stringify(payload), opts, err => {
      if (err) console.error(`Error al publicar en ${topic}:`, err);
      else     console.log(`Publicado en ${topic}`);
    });
  }

  disconnect() {
    if (this.client) {
      this.client.end();
      this.client = null;
      this.handlers.clear();
      console.log('🔌 MQTT desconectado');
    }
  }
  onConnectionChange(listener: (connected: boolean) => void) {
    this.connectionListeners.push(listener);
    return () => {
      this.connectionListeners = this.connectionListeners.filter(l => l !== listener);
    };
  }
}

export const mqttService = new MqttService();
export function useMqtt() {
  const connected = ref(mqttService.isConnected());

  const stop = mqttService.onConnectionChange(state => {
    connected.value = state;
  });

  onUnmounted(stop);

  return { mqttService, connected };
}
