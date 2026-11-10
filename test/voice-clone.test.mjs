// Zero-dependency mock-server test for src/integrations/voice-clone.ts.
//
// Compiles the TS source with the project's own tsc, then drives cloneVoice()
// against a plain node:http mock server on 127.0.0.1 — no GPT-SoVITS server,
// GPU, or paid service needed.
//
// Run: node test/voice-clone.test.mjs   (or: npm test)
import { spawnSync } from "node:child_process";
import { createServer } from "node:http";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import assert from "node:assert/strict";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const work = mkdtempSync(join(tmpdir(), "vanta-voice-clone-test-"));

try {
  // 1. Compile the integration to plain JS with the project's tsc.
  const tsc = join(root, "node_modules", ".bin", "tsc");
  const compiled = spawnSync(
    tsc,
    [
      join(root, "src", "integrations", "voice-clone.ts"),
      "--module",
      "commonjs",
      "--target",
      "es2020",
      "--lib",
      "es2020,dom",
      "--skipLibCheck",
      "--outDir",
      work,
    ],
    { encoding: "utf8" },
  );
  assert.equal(
    compiled.status,
    0,
    `tsc failed:\n${compiled.stdout}\n${compiled.stderr}`,
  );

  const { cloneVoice } = await import(join(work, "voice-clone.js"));

  // 2. Mock voice server: records every request body, answers like GPT-SoVITS.
  const requests = [];
  const server = createServer((req, res) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => {
      requests.push({
        url: req.url,
        contentType: req.headers["content-type"] ?? "",
        body: Buffer.concat(chunks),
      });
      if (req.url === "/clone") {
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ voice_id: "voice-123" }));
      } else if (req.url === "/tts") {
        res.writeHead(200, { "Content-Type": "audio/wav" });
        res.end(Buffer.from("FAKE-WAV"));
      } else {
        res.writeHead(404);
        res.end();
      }
    });
  });
  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const serverUrl = `http://127.0.0.1:${server.address().port}`;

  const marker = `VANTA-TEST-SAMPLE-${Date.now()}`;
  const samplePath = join(work, "sample.wav");
  writeFileSync(samplePath, marker);

  // 3. Path input: the /clone body must actually contain the sample bytes.
  const voice = await cloneVoice({ serverUrl, sampleAudioPath: samplePath });
  assert.equal(voice.id, "voice-123");
  const cloneReq = requests.find((r) => r.url === "/clone");
  assert.ok(cloneReq, "expected a POST to /clone");
  assert.match(cloneReq.contentType, /^multipart\/form-data/);
  assert.ok(
    cloneReq.body.includes(Buffer.from(marker)),
    "uploaded body must contain the sample bytes",
  );
  assert.ok(
    cloneReq.body.includes(Buffer.from('name="audio"')),
    'uploaded body must carry the "audio" field',
  );

  // 4. speak() posts the returned voice_id to /tts and returns a blob URL.
  const audioUrl = await voice.speak("Hello from Vanta");
  assert.ok(
    audioUrl.startsWith("blob:"),
    `speak() should return a blob URL, got ${audioUrl}`,
  );
  const ttsReq = requests.find((r) => r.url === "/tts");
  assert.ok(ttsReq, "expected a POST to /tts");
  const ttsBody = JSON.parse(ttsReq.body.toString("utf8"));
  assert.equal(ttsBody.voice_id, "voice-123");
  assert.equal(ttsBody.text, "Hello from Vanta");

  // 5. Blob input: same upload, no file read.
  requests.length = 0;
  const voice2 = await cloneVoice({
    serverUrl,
    sampleAudio: new Blob([marker]),
  });
  assert.equal(voice2.id, "voice-123");
  const cloneReq2 = requests.find((r) => r.url === "/clone");
  assert.ok(
    cloneReq2.body.includes(Buffer.from(marker)),
    "Blob input must also upload the sample bytes",
  );

  // 6. Neither input: a clear error, and no request sent.
  requests.length = 0;
  await assert.rejects(
    () => cloneVoice({ serverUrl }),
    /sampleAudioPath or sampleAudio/,
  );
  assert.equal(
    requests.length,
    0,
    "no request should be sent without a sample",
  );

  server.close();
  console.log("voice-clone: 6 checks passed");
} finally {
  rmSync(work, { recursive: true, force: true });
}
