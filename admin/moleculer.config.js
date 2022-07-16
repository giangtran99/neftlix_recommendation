"use strict";

const { inspect } = require("util");
const { Middlewares } = require("moleculer");
const created = require("./backend/middlewares/prometheus-sd");
Middlewares.prometheusSD = { created };

const redisSetting = process.env.REDIS_PW ? {
	host: process.env.REDIS_HOST || "localhost",
	port: process.env.REDIS_PORT || 6379,
	password: process.env.REDIS_PW || "",
	db: process.env.REDIS_DB || 0
} : {
	host: process.env.REDIS_HOST || "localhost",
	port: process.env.REDIS_PORT || 6379,
	db: process.env.REDIS_DB || 0
};

// More info about options: https://moleculer.services/docs/0.13/broker.html#Broker-options
module.exports = {
	namespace: "",
	nodeID: null,

	logger: [
		{
			type: "Console",
			options: {
				formatter: "short",
				moduleColors: true,
				//autoPadding: true
				objectPrinter: o => inspect(o, { depth: 4, colors: true, breakLength: 100 }),
			}
		},
		{
			type: "File",
			options: {
				folder: "./logs",
				filename: "all-{date}.log",
				formatter: "full",
			}
		},
		{
			type: "File",
			options: {
				level: "warn",
				folder: "./logs/moleculer",
				filename: "warn-{date}.log",
				formatter: "full",
			}
		},
		{
			type: "File",
			options: {
				level: "error",
				folder: "./logs/moleculer",
				filename: "error-{date}.json",
				formatter: "json"
			}
		}
	],
	// Default log level for built-in console logger. It can be overwritten in logger options above.
	// Available values: trace, debug, info, warn, error, fatal
	logLevel: "info",

	// Define transporter.
	// More info: https://moleculer.services/docs/0.14/networking.html
	// Note: During the development, you don't need to define it because all services will be loaded locally.
	// In production you can set it via `TRANSPORTER=nats://localhost:4222` environment variable.
	transporter: null,

	cacher: {
		type: "Redis",
		options: {
			// Prefix for keys
			prefix: process.env.REDIS_PREFIX || "MOL",
			// set Time-to-live to 30sec.
			ttl: 60,
			// Turns Redis client monitoring on.
			monitor: false,
			// Redis settings
			redis: redisSetting
		}
	},

	// Define a serializer.
	// Available values: "JSON", "Avro", "ProtoBuf", "MsgPack", "Notepack", "Thrift".
	// More info: https://moleculer.services/docs/0.14/networking.html#Serialization
	serializer: "JSON",

	// Number of milliseconds to wait before reject a request with a RequestTimeout error. Disabled: 0
	requestTimeout: 10 * 1000,

	// Retry policy settings. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Retry
	retryPolicy: {
		// Enable feature
		enabled: false,
		// Count of retries
		retries: 5,
		// First delay in milliseconds.
		delay: 100,
		// Maximum delay in milliseconds.
		maxDelay: 1000,
		// Backoff factor for delay. 2 means exponential backoff.
		factor: 2,
		// A function to check failed requests.
		check: err => err && !!err.retryable
	},

	// Limit of calling level. If it reaches the limit, broker will throw an MaxCallLevelError error. (Infinite loop protection)
	maxCallLevel: 100,

	// Number of seconds to send heartbeat packet to other nodes.
	heartbeatInterval: 10,
	// Number of seconds to wait before setting node to unavailable status.
	heartbeatTimeout: 30,

	// Cloning the params of context if enabled. High performance impact, use it with caution!
	contextParamsCloning: false,

	// Tracking requests and waiting for running requests before shuting down. More info: https://moleculer.services/docs/0.14/context.html#Context-tracking
	tracking: {
		// Enable feature
		enabled: false,
		// Number of milliseconds to wait before shuting down the process.
		shutdownTimeout: 5000,
	},

	transit: {
		maxQueueSize: 500 * 1000,
		disableReconnect: false,
		disableVersionCheck: false,
		packetLogFilter: ["HEARTBEAT"]
	},


	// Disable built-in request & emit balancer. (Transporter must support it, as well.). More info: https://moleculer.services/docs/0.14/networking.html#Disabled-balancer
	disableBalancer: false,

	// Settings of Service Registry. More info: https://moleculer.services/docs/0.14/registry.html
	registry: {
		// Define balancing strategy. More info: https://moleculer.services/docs/0.14/balancing.html
		// Available values: "RoundRobin", "Random", "CpuUsage", "Latency", "Shard"
		strategy: "RoundRobin",
		// Enable local action call preferring. Always call the local action instance if available.
		preferLocal: true
	},

	// Settings of Circuit Breaker. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Circuit-Breaker
	circuitBreaker: {
		// Enable feature
		enabled: false,
		// Threshold value. 0.5 means that 50% should be failed for tripping.
		threshold: 0.5,
		// Minimum request count. Below it, CB does not trip.
		minRequestCount: 20,
		// Number of seconds for time window.
		windowTime: 60,
		// Number of milliseconds to switch from open to half-open state
		halfOpenTime: 10 * 1000,
		// A function to check failed requests.
		check: err => err && err.code >= 500
	},

	// Settings of bulkhead feature. More info: https://moleculer.services/docs/0.14/fault-tolerance.html#Bulkhead
	bulkhead: {
		// Enable feature.
		enabled: false,
		// Maximum concurrent executions.
		concurrency: 10,
		// Maximum size of queue
		maxQueueSize: 100,
	},

	// Enable action & event parameter validation. More info: https://moleculer.services/docs/0.14/validating.html
	validator: true,

	errorHandler: null,

	// Enable/disable built-in metrics function. More info: https://moleculer.services/docs/0.14/metrics.html
	metrics: {
		enabled: true,
		// Available built-in reporters: "Console", "CSV", "Event", "Prometheus", "Datadog", "StatsD"
		/* reporter: {
			type: "Prometheus",
			options: {
				// HTTP port
				port: 3070,
				// HTTP URL path
				path: "/metrics",
				// Default labels which are appended to all metrics labels
				defaultLabels: registry => ({
					namespace: registry.broker.namespace,
					nodeID: registry.broker.nodeID
				})
			}
		} */
	},

	// Enable built-in tracing function. More info: https://moleculer.services/docs/0.14/tracing.html
	tracing: {
		enabled: true,
		// Available built-in exporters: "Console", "Datadog", "Event", "EventLegacy", "Jaeger", "Zipkin"
		exporter: [
			{
				type: "Console", // Console exporter is only for development!
				options: {
					// Custom logger
					logger: null,
					// Using colors
					colors: true,
					// Width of row
					width: 100,
					// Gauge width in the row
					gaugeWidth: 40
				}
			},
			{
				type: "Jaeger",
				options: {
					// HTTP Reporter endpoint. If set, HTTP Reporter will be used.
					endpoint: null,
					// UDP Sender host option.
					host: process.env.JAEGER_SENDER || "127.0.0.1",
					// UDP Sender port option.
					port: 6832,
					// Jaeger Sampler configuration.
					sampler: {
						// Sampler type. More info: https://www.jaegertracing.io/docs/1.14/sampling/#client-sampling-configuration
						type: "Const",
						// Sampler specific options.
						options: {}
					},
					// Additional options for `Jaeger.Tracer`
					tracerOptions: {},
					// Default tags. They will be added into all span tags.
					defaultTags: null
				}
			}
			/* {
				type: "Zipkin",
				options: {
					baseURL: "http://localhost:9411",
				}
			} */
		]
	},

	// Rate of metrics calls. 1 means to measure every request, 0 means to measure nothing.
	metricsRate: 1,

	// Register internal services ("$node"). More info: https://moleculer.services/docs/0.14/services.html#Internal-services
	internalServices: true,
	// Register internal middlewares. More info: https://moleculer.services/docs/0.14/middlewares.html#Internal-middlewares
	internalMiddlewares: true,

	// Watch the loaded services and hot reload if they changed. You can also enable it in Moleculer Runner with `--hot` argument
	hotReload: false,

	// Register custom REPL commands.
	replCommands: null,

	// Register custom middlewares
	middlewares: [
		"prometheusSD",
		require("./backend/middlewares/CheckPermissions"),
		require("./backend/middlewares/FindEntity"),
	],

	// Called after broker created.
	created(broker) {

	},

	// Called after broker starte.
	started(broker) {
		if (process.env.TEST_E2E) {
			require("./tests/e2e/bootstrap")(broker);
		}
	},

	// Called after broker stopped.
	stopped(broker) {

	},
};


