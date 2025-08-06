import * as opentelemetry from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';

// Set OpenTelemetry logs to debug level
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

let isOtelInitialized = false;

// Create trace exporter (HTTP)
const traceExporter = new OTLPTraceExporter({
  url: 'http://otel-collector:4318/v1/traces',
});

// Create metric exporter (HTTP)
const metricExporter = new OTLPMetricExporter({
  url: 'http://otel-collector:4318/v1/metrics',
});

// Create the OpenTelemetry SDK
const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

// Start OpenTelemetry
async function startOpenTelemetry() {
  try {
    await sdk.start();
    console.log('✅ OpenTelemetry SDK initialized successfully');
    isOtelInitialized = true;
  } catch (error) {
    console.error('❌ Error initializing OpenTelemetry SDK:', error);
    isOtelInitialized = false;
  }
}

startOpenTelemetry();

// Export health check function
export function isTelemetryHealthy(): boolean {
  return isOtelInitialized;
}
