export type ServiceStatus = "active" | "paused";
export type Method = "GET" | "POST";

export interface Service {
  id: string;
  url: string;
  method: Method;
  interval: number; // minutes
  status: ServiceStatus;
  lastPing: string;
  headers?: { key: string; value: string }[];
}

export interface LogEntry {
  id: string;
  serviceId?: string;
  serviceUrl?: string;
  timestamp: string;
  status: "success" | "fail";
  statusCode: number;
  responseTime: number;
  error?: string;
}

export const initialServices: Service[] = [
  {
    id: "1",
    url: "https://my-api-1.onrender.com",
    method: "GET",
    interval: 5,
    status: "active",
    lastPing: "2 mins ago",
  },
  {
    id: "2",
    url: "https://my-api-2.onrender.com",
    method: "GET",
    interval: 10,
    status: "paused",
    lastPing: "10 mins ago",
  },
  {
    id: "3",
    url: "https://payments-service.fly.dev",
    method: "POST",
    interval: 1,
    status: "active",
    lastPing: "30 secs ago",
  },
];

export const initialLogs: LogEntry[] = [
  { id: "l1", serviceUrl: "https://my-api-1.onrender.com", timestamp: "2026-04-24 10:00", status: "success", statusCode: 200, responseTime: 120 },
  { id: "l2", serviceUrl: "https://my-api-1.onrender.com", timestamp: "2026-04-24 10:05", status: "fail", statusCode: 500, responseTime: 300, error: "Timeout" },
  { id: "l3", serviceUrl: "https://payments-service.fly.dev", timestamp: "2026-04-24 10:06", status: "success", statusCode: 204, responseTime: 88 },
  { id: "l4", serviceUrl: "https://my-api-2.onrender.com", timestamp: "2026-04-24 10:10", status: "success", statusCode: 200, responseTime: 145 },
  { id: "l5", serviceUrl: "https://payments-service.fly.dev", timestamp: "2026-04-24 10:11", status: "fail", statusCode: 502, responseTime: 511, error: "Bad gateway" },
  { id: "l6", serviceUrl: "https://my-api-1.onrender.com", timestamp: "2026-04-24 10:15", status: "success", statusCode: 200, responseTime: 102 },
];

export function deriveServiceName(url: string): string {
  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, "");
    const first = host.split(".")[0];
    return first.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  } catch {
    return url;
  }
}
