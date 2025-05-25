/* eslint-disable */

import { vi } from "vitest";
import { cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

vi.mock("@/features/workers.ts");

afterEach(cleanup);
