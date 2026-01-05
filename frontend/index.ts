export * from "./app/lib/types/grievance";

// API Service (main interface for UI components)
export { default as GrievanceAPI } from "./app/lib/api/grievance-service";
export * from "./app/lib/api/grievance-service";

// Mock Data (only import directly for testing/seeding)
export * from "./app/lib/mock-data/locations";
export * from "./app/lib/mock-data/officers";
export * from "./app/lib/mock-data/schemes";
export * from "./app/lib/mock-data/grievances";
