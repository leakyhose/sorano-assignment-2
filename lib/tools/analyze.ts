import { tool } from "ai";
import { z } from "zod";

/**
 * TODO: Implement the code analysis tool
 *
 * This tool should:
 * 1. Accept a Python code string as a parameter
 * 2. Execute the code using the system's Python interpreter
 * 3. Return the stdout output (and stderr if there are errors)
 *
 * How it works:
 *   - The LLM generates Python code to analyze data, do calculations, etc.
 *   - This tool executes that code and returns the output
 *   - The LLM then interprets the results for the user
 *
 * Steps to implement:
 *   a. Define the tool parameters schema using Zod:
 *      - code (string, required): The Python code to execute
 *
 *   b. Execute the Python code:
 *      - Use `child_process.execSync` or `child_process.spawn`
 *      - Run: python3 -c "<code>"
 *      - Set a timeout (e.g., 10 seconds) to prevent infinite loops
 *      - Capture both stdout and stderr
 *
 *   c. Return the results:
 *      - stdout: The program's output
 *      - stderr: Any error messages (if applicable)
 *      - exitCode: 0 for success, non-zero for errors
 *
 *   d. Handle errors:
 *      - Timeout exceeded
 *      - Python not installed
 *      - Syntax errors in the code
 *      - Runtime errors
 *
 * Hints:
 *   - Use `execSync` for simplicity, it blocks until the command finishes
 *   - Pass the code via stdin or -c flag to avoid shell escaping issues
 *   - Set `maxBuffer` to handle larger outputs
 *   - Consider using `spawnSync` with `input` option to pipe code via stdin:
 *       spawnSync("python3", ["-c", code], { timeout: 10000, encoding: "utf-8" })
 *
 * Safety notes (mention in INSTRUCTIONS.md):
 *   - This runs arbitrary code on the local machine
 *   - In production, you would sandbox this (Docker, etc.)
 *   - For this assessment, local execution is fine
 */

export const analyzeTool = tool({
  description:
    "Execute Python code for data analysis, calculations, or processing. The LLM writes Python code, and this tool runs it and returns the output.",
  parameters: z.object({
    // TODO: Define your parameters here
    // Example:
    // code: z.string().describe("Python code to execute"),
  }),
  execute: async (params) => {
    // TODO: Implement the Python code execution logic
    // 1. Extract the code from params
    // 2. Execute it with python3
    // 3. Return stdout, stderr, and exit code

    return {
      error: "Analysis tool not implemented yet. See TODO comments in lib/tools/analyze.ts",
    };
  },
});
