import { tool } from "ai";
import { z } from "zod";
import { spawnSync } from "child_process";

const TIMEOUT_MS = 10_000;
const MAX_BUFFER = 1024 * 1024; // 1 MB

export const analyzeTool = tool({
  description:
    "Execute Python code for data analysis, calculations, or processing. The LLM writes Python code, and this tool runs it and returns the output.",
  parameters: z.object({
    code: z.string().describe("Python code to execute"),
  }),
  execute: async ({ code }) => {
    try {
      // spawnSync with an argv array avoids shell interpolation, which
      // prevents shell-injection issues that execSync would be prone to.
      const result = spawnSync("python3", ["-c", code], {
        timeout: TIMEOUT_MS,
        maxBuffer: MAX_BUFFER,
        encoding: "utf-8",
      });

      if (result.error) {
        return { error: `Execution error: ${result.error.message}` };
      }

      return {
        stdout: result.stdout ?? "",
        stderr: result.stderr ?? "",
        exitCode: result.status ?? 1,
      };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      return { error: `Failed to execute Python code: ${message}` };
    }
  },
});
