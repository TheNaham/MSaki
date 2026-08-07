import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const REPO_OWNER = "TheNaham";
const REPO_NAME = "tljquiz";
const FILE_PATH = "data/decision-log.json";
const BRANCHES = ["main", "claude/tlj-global-portfolio-site-mg72st"];

interface CompletePayload {
  scenarioTitle: string;
  choiceText: string;
  grade: "good" | "ok" | "risky";
  feedback: string;
}

async function githubContentsApi(path: string, init: RequestInit) {
  const res = await fetch(
    `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json",
        ...(init.headers || {}),
      },
    }
  );
  return res;
}

async function appendEntryOnBranch(branch: string, entry: Record<string, string>) {
  const getRes = await githubContentsApi(
    `contents/${FILE_PATH}?ref=${branch}`,
    { method: "GET" }
  );
  if (!getRes.ok) {
    throw new Error(`GET ${branch} failed: ${getRes.status} ${await getRes.text()}`);
  }
  const file = await getRes.json();
  const current = JSON.parse(
    Buffer.from(file.content, "base64").toString("utf-8")
  );
  current.push(entry);
  const updated = JSON.stringify(current, null, 2) + "\n";

  const putRes = await githubContentsApi(`contents/${FILE_PATH}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Log decision: ${entry.scenarioTitle} (${entry.date})`,
      content: Buffer.from(updated, "utf-8").toString("base64"),
      sha: file.sha,
      branch,
    }),
  });
  if (!putRes.ok) {
    throw new Error(`PUT ${branch} failed: ${putRes.status} ${await putRes.text()}`);
  }
}

export async function POST(req: NextRequest) {
  if (!process.env.GITHUB_TOKEN) {
    return NextResponse.json(
      { ok: false, error: "GITHUB_TOKEN not configured on server" },
      { status: 500 }
    );
  }

  const body = (await req.json()) as CompletePayload;
  if (!body.scenarioTitle || !body.choiceText || !body.grade) {
    return NextResponse.json(
      { ok: false, error: "missing fields" },
      { status: 400 }
    );
  }

  const entry = {
    date: new Date().toISOString().slice(0, 10),
    scenarioTitle: body.scenarioTitle,
    choiceText: body.choiceText,
    grade: body.grade,
    feedback: body.feedback,
  };

  const results = await Promise.allSettled(
    BRANCHES.map((branch) => appendEntryOnBranch(branch, entry))
  );
  const failed = results
    .map((r, i) => ({ r, branch: BRANCHES[i] }))
    .filter(({ r }) => r.status === "rejected");

  if (failed.length === BRANCHES.length) {
    return NextResponse.json(
      {
        ok: false,
        error: failed.map((f) => (f.r as PromiseRejectedResult).reason?.message).join("; "),
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    committedBranches: BRANCHES.filter((b) => !failed.some((f) => f.branch === b)),
  });
}
