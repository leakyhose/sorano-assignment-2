import { tool } from "ai";
import { z } from "zod";
import { spawnSync } from "child_process";

const TIMEOUT_MS = 10_000;
const MAX_BUFFER = 1024 * 1024; // 1 MB
const PYTHON_CMD = process.platform === "win32" ? "python" : "python3";

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
      const result = spawnSync(PYTHON_CMD, ["-c", code], {
        timeout: TIMEOUT_MS,
        maxBuffer: MAX_BUFFER,
        encoding: "utf-8",
      });

      // spawnSync sets result.error for system-level failures
      if (result.error) {
        // Process killed after exceeding the timeout
        if (("code" in result.error && result.error.code === "ETIMEDOUT") || result.signal === "SIGTERM") {
          return { error: `Execution timed out (${TIMEOUT_MS / 1000}s limit)` };
        }

        // Python binary not found on the system
        if ("code" in result.error && result.error.code === "ENOENT") {
          return { error: "Python not found. Ensure Python 3 is installed." };
        }

        return { error: `Execution error: ${result.error.message}` };
      }

      // Return stdout, stderr, and exit code so the LLM can interpret the
      // output or explain errors (syntax/runtime) back to the user.
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
